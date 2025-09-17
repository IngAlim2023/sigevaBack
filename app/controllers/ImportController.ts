/* eslint-disable @unicorn/filename-case */
// ImportExcelController.ts
import type { HttpContext } from '@adonisjs/core/http'
import Aprendiz from '#models/aprendiz'
import Perfil from '#models/perfil'
import Grupo from '#models/grupo'
import ProgramaFormacion from '#models/programa_formacion'
import NivelFormacion from '#models/nivel_formacion'
import db from '@adonisjs/lucid/services/db'
import bcrypt from 'bcrypt'
import XLSX from 'xlsx'
import { nanoid } from 'nanoid'

import ValidacionVoto from '#models/validacion_voto'
import mail from '@adonisjs/mail/services/main'

import Usuario from '#models/usuario'

export default class ImportExcelController {
  // Método para importar aprendices

  public async importarAprendices({ request, response }: HttpContext) {
    const trx = await db.transaction()

    try {
      // 1) Contexto: userId desde el frontend
      const userId = Number(request.input('userId'))
      if (!userId) {
        return response.badRequest({ success: false, message: 'Falta userId en el body' })
      }

      const usuario = await Usuario.find(userId)
      if (!usuario) {
        return response.unauthorized({ success: false, message: 'Usuario inválido' })
      }

      // Perfiles permitidos
      const perfilFuncionario = await Perfil.query()
        .whereRaw('LOWER(perfil) = LOWER(?)', ['funcionario'])
        .first()
      const perfilAdministrador = await Perfil.query()
        .whereRaw('LOWER(perfil) = LOWER(?)', ['administrador'])
        .first()

      if (!perfilFuncionario || !perfilAdministrador) {
        return response.status(500).json({
          success: false,
          message: 'Perfiles requeridos no configurados (Funcionario/Administrador)',
        })
      }

      const esFuncionario = usuario.idperfil === perfilFuncionario.idperfil
      const esAdministrador = usuario.idperfil === perfilAdministrador.idperfil

      if (!esFuncionario && !esAdministrador) {
        return response.forbidden({
          success: false,
          message: 'Solo administradores o funcionarios pueden importar aprendices',
        })
      }

      // Determinar centro según el rol
      let centroFormacionId: number | null = null
      if (esFuncionario) {
        centroFormacionId = usuario.idcentro_formacion
        if (!centroFormacionId) {
          return response.badRequest({
            success: false,
            message: 'El funcionario no tiene centro de formación asignado',
          })
        }
      } else {
        const bodyCentro = Number(request.input('centroFormacionId'))
        if (!bodyCentro) {
          return response.badRequest({
            success: false,
            message: 'Debes enviar centroFormacionId en el body (administrador)',
          })
        }
        // (Opcional) validar existencia del centro
        centroFormacionId = bodyCentro
      }

      // 2) Archivo y params
      const file = request.file('excel')
      const { jornada } = request.only(['jornada'])

      if (!file) {
        return response.status(400).json({
          success: false,
          message: 'Debes subir un archivo Excel',
        })
      }

      // 3) Leer Excel
      const workbook = XLSX.read(file.tmpPath, { type: 'file' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]

      const fichaCelda = sheet['C2']?.v?.toString().trim() || ''
      const fichaLimpia = fichaCelda.replace(/–/g, '-')
      const partes = fichaLimpia.split(' - ')
      const numeroGrupo = partes[0]?.trim() || ''
      const nombrePrograma = partes[1]?.trim() || ''

      if (!numeroGrupo || !nombrePrograma) {
        return response.status(400).json({
          success: false,
          message: 'No se encontró la ficha de caracterización o el programa en el Excel',
        })
      }

      const data: any[] = XLSX.utils.sheet_to_json(sheet, { range: 4, defval: '' })
      // Recolectar todos los números de documento y correos
      const docsSet = new Set<string>()
      const emailsSet = new Set<string>()
      const filasProcesables: any[] = []

      for (const fila of data) {
        const numeroDocumento = (fila['Número de Documento'] || '').toString().trim()
        const email = (fila['Correo Electrónico'] || '').toString().trim().toLowerCase()

        if (!numeroDocumento && !email) continue // nada con qué buscar

        filasProcesables.push({ fila, numeroDocumento, email })
        if (numeroDocumento) docsSet.add(numeroDocumento)
        if (email) emailsSet.add(email)
      }

      // Perfil "Aprendiz"
      const perfil = await Perfil.query().whereRaw('LOWER(perfil) = LOWER(?)', ['aprendiz']).first()

      if (!perfil) {
        await trx.rollback()
        return response.status(500).json({
          success: false,
          message: 'El perfil "Aprendiz" no existe. Debes inicializar los perfiles en la BD',
        })
      }

      // Nivel "Técnico"
      let nivel = await NivelFormacion.query().where('nivel_formacion', 'Técnico').first()
      if (!nivel) {
        nivel = new NivelFormacion()
        nivel.nivel_formacion = 'Técnico'
        await nivel.useTransaction(trx).save()
      }

      const AREA_SOFTWARE_ID = 1

      // Grupo
      let grupo = await Grupo.query().where('grupo', numeroGrupo).first()
      if (!grupo) {
        grupo = new Grupo()
        grupo.grupo = numeroGrupo
        grupo.jornada = jornada
        await grupo.useTransaction(trx).save()
      }

      // Programa
      let programa = await ProgramaFormacion.query().where('programa', nombrePrograma).first()
      if (!programa) {
        programa = new ProgramaFormacion()
        Object.assign(programa, {
          programa: nombrePrograma,
          idnivel_formacion: nivel.idnivel_formacion,
          idarea_tematica: AREA_SOFTWARE_ID,
          codigo_programa: 'N/A',
          version: '1.0',
          duracion: 0,
        })
        await programa.useTransaction(trx).save()
      } else {
        programa.merge({
          idnivel_formacion: programa.idnivel_formacion || nivel.idnivel_formacion,
          idarea_tematica: programa.idarea_tematica || AREA_SOFTWARE_ID,
          codigo_programa: programa.codigo_programa || 'N/A',
          version: programa.version || '1.0',
          duracion: programa.duracion || 0,
        })
        await programa.useTransaction(trx).save()
      }

      // 5) Iterar filas
      // ---------- Nueva lógica para evitar duplicados ----------
      if (filasProcesables.length === 0) {
        await trx.commit()
        return response.ok({ success: true, message: 'No hay filas válidas en el Excel' })
      }

      // Traer de una sola consulta los aprendices existentes
      const docsArray = Array.from(docsSet)
      const emailsArray = Array.from(emailsSet)

      const existentesQuery = Aprendiz.query()
        .where('centro_formacion_idcentro_formacion', centroFormacionId!)
        .andWhere((q) => {
          if (docsArray.length) q.whereIn('numero_documento', docsArray)
          if (emailsArray.length) {
            if (docsArray.length) q.orWhereIn('email', emailsArray)
            else q.whereIn('email', emailsArray)
          }
        })
        .useTransaction(trx)

      const existentes = await existentesQuery

      // Mapear existentes
      const existentesPorDoc = new Map<string, any>()
      const existentesPorEmail = new Map<string, any>()
      for (const a of existentes) {
        if (a.numero_documento) existentesPorDoc.set(a.numero_documento.toString(), a)
        if (a.email) existentesPorEmail.set(a.email.toLowerCase(), a)
      }

      const paraInsertar: any[] = []

      for (const item of filasProcesables) {
        const fila = item.fila

        // normalizar y limpiar identificadores
        const numeroDocumentoRaw = (item.numeroDocumento || '').toString().trim()
        const numeroDocumento = numeroDocumentoRaw ? numeroDocumentoRaw.replace(/\s+/g, '') : ''

        // 🔹 Normalizar email y eliminar caracteres invisibles
        const emailRaw = (item.email || '').toString().trim()
        const email = emailRaw ? emailRaw.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '') : ''

        // 🔹 Validar que haya email
        if (!email) {
          console.warn(`Fila ignorada por email vacío: ${fila['Nombre']} ${fila['Apellidos']}`)
          continue
        }

        // 🔹 Normalizar estado
        let estadoRaw = (fila['Estado'] || '').toString().trim().toLowerCase()
        const estado = estadoRaw === '' ? 'activo' : estadoRaw

        const tipoDocumento = fila['Tipo de Documento'] || ''
        const nombres = fila['Nombre'] || ''
        const apellidos = fila['Apellidos'] || ''
        const celular = fila['Celular'] || ''

        // Construir otrosCampos filtrando claves invalidas (__EMPTY, '', null)
        const rawOtros: Record<string, any> = { ...fila }
        delete rawOtros['Tipo de Documento']
        delete rawOtros['Número de Documento']
        delete rawOtros['Nombre']
        delete rawOtros['Apellidos']
        delete rawOtros['Celular']
        delete rawOtros['Correo Electrónico']
        delete rawOtros['Estado']

        const otrosCampos: Record<string, any> = {}
        for (const [key, val] of Object.entries(rawOtros)) {
          if (!key) continue
          const k = key.toString().trim()
          if (k === '' || k.startsWith('__EMPTY')) continue
          // opcional: normalizar claves, p.ej. quitar espacios múltiples
          const keyNormalized = k
          otrosCampos[keyNormalized] = val
        }

        // Verificar si ya existe (usar valores normalizados)
        const existe =
          (numeroDocumento && existentesPorDoc.get(numeroDocumento)) ||
          (email && existentesPorEmail.get(email))

        if (!existe) {
          const passwordTemporal =
            numeroDocumento || email || Math.random().toString(36).slice(2, 10)
          const hashedPassword = await bcrypt.hash(passwordTemporal, 10)

          const aprendizNuevo = {
            idgrupo: grupo.idgrupo,

            idprograma_formacion: programa.idprograma_formacion,
            perfil_idperfil: perfil.idperfil,
            nombres,
            apellidos,
            celular,
            estado,
            tipo_documento: tipoDocumento,
            numero_documento: numeroDocumento,
            email,
            password: hashedPassword,
            centro_formacion_idcentro_formacion: centroFormacionId,
          }

          paraInsertar.push(aprendizNuevo)
        }
      }

      if (paraInsertar.length > 0) {
        const chunkSize = 200
        for (let i = 0; i < paraInsertar.length; i += chunkSize) {
          const chunk = paraInsertar.slice(i, i + chunkSize)
          for (const item of chunk) {
            const model = new Aprendiz()
            model.merge(item)
            await model.useTransaction(trx).save()

            const otpCode = nanoid(6).toUpperCase()

            const validacion = new ValidacionVoto()
            validacion.merge({
              codigo: otpCode,
              aprendiz_idaprendiz: model.idaprendiz,
              elecciones_ideleccion: Number(request.input('eleccion_id')),
            })
            await validacion.useTransaction(trx).save()

            try {
              await mail.send((message) => {
                message
                  .to(model.email)
                  .from(process.env.MAIL_FROM_ADDRESS || 'noreply@sigeva.com')
                  .subject('Código OTP para Votación - SIGEVA').html(`
          <h2>Hola ${model.nombres} ${model.apellidos}</h2>
          <p>Tu código OTP para votar es: <strong>${otpCode}</strong></p>
          <p>Este código expira en ${process.env.OTP_EXPIRATION_MINUTES || 5} minutos.</p>
        `)
              })
            } catch (e) {
              console.error(`Error enviando OTP a ${model.email}:`, e.message)
            }
          }
        }
      }

      await trx.commit()
      return response.ok({
        success: true,
        message: 'Importación procesada',
        inserted: paraInsertar.length,
        skipped: filasProcesables.length - paraInsertar.length,
      })
    } catch (error: any) {
      await trx.rollback()
      console.error('Error en importarAprendices completo:', error)
      console.error('Stack trace:', error.stack)
      return response.status(500).json({
        success: false,
        message: 'Error al importar aprendices',

        error: error.message,
      })
    }
  }

  // Dentro de ImportExcelController
}
