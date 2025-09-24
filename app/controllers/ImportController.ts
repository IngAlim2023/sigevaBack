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

import Usuario from '#models/usuario'

export default class ImportExcelController {
  public async importarAprendices({ request, response }: HttpContext) {
    const trx = await db.transaction()

    try {
      // Inicializar contadores
      let inserted = 0
      let updated = 0
      let skipped = 0
      let skippedAprendices: any[] = []

      // 1) Contexto: userId desde el frontend
      const userId = Number(request.input('userId'))
      if (!userId) {
        await trx.rollback()
        return response.badRequest({ success: false, message: 'Falta userId en el body' })
      }

      const usuario = await Usuario.find(userId)
      if (!usuario) {
        await trx.rollback()
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
        await trx.rollback()
        return response.status(500).json({
          success: false,
          message: 'Perfiles requeridos no configurados (Funcionario/Administrador)',
        })
      }

      const esFuncionario = usuario.idperfil === perfilFuncionario.idperfil
      const esAdministrador = usuario.idperfil === perfilAdministrador.idperfil

      if (!esFuncionario && !esAdministrador) {
        await trx.rollback()
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
          await trx.rollback()
          return response.badRequest({
            success: false,
            message: 'El funcionario no tiene centro de formación asignado',
          })
        }
      } else {
        const bodyCentro = Number(request.input('centroFormacionId'))
        if (!bodyCentro) {
          await trx.rollback()
          return response.badRequest({
            success: false,
            message: 'Debes enviar centroFormacionId en el body (administrador)',
          })
        }
        centroFormacionId = bodyCentro
      }

      // Leer flag updateIfExists
      const updateIfExistsRaw = request.input('updateIfExists')
      const updateIfExists =
        updateIfExistsRaw === undefined
          ? true
          : updateIfExistsRaw === '1' || updateIfExistsRaw === 1 || updateIfExistsRaw === true

      // 2) Archivo y params
      const file = request.file('excel')
      const { jornada } = request.only(['jornada'])

      if (!file) {
        await trx.rollback()
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
        await trx.rollback()
        return response.status(400).json({
          success: false,
          message: 'No se encontró la ficha de caracterización o el programa en el Excel',
        })
      }

      const data: any[] = XLSX.utils.sheet_to_json(sheet, { range: 4, defval: '' })

      const normalizeDoc = (d: any) =>
        d === null || d === undefined ? '' : String(d).trim().replace(/\s+/g, '')
      const normalizeEmail = (e: any) =>
        e === null || e === undefined ? '' : String(e).trim().toLowerCase()

      // Recolectar documentos y correos
      const docsSet = new Set<string>()
      const emailsSet = new Set<string>()
      const filasProcesables: any[] = []

      for (const fila of data) {
        const numeroDocumento = normalizeDoc(fila['Número de Documento'])
        const email = normalizeEmail(fila['Correo Electrónico'])

        if (!numeroDocumento && !email) continue

        filasProcesables.push({ fila, numeroDocumento, email })
        if (numeroDocumento) docsSet.add(numeroDocumento)
        if (email) emailsSet.add(email)
      }

      if (filasProcesables.length === 0) {
        await trx.commit()
        return response.ok({
          success: true,
          message: 'No hay filas válidas',
          inserted: 0,
          updated: 0,
          skipped: 0,
        })
      }

      // Perfil y nivel
      const perfil = await Perfil.query().whereRaw('LOWER(perfil) = LOWER(?)', ['aprendiz']).first()
      if (!perfil) throw new Error('El perfil "Aprendiz" no existe.')

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

      // ----------------- FILTRO DE DUPLICADOS DENTRO DEL MISMO EXCEL -----------------
      const seenDocs = new Set<string>()
      const seenEmails = new Set<string>()
      const filasUnicas: any[] = []

      for (const item of filasProcesables) {
        const { numeroDocumento, email } = item
        if (
          (numeroDocumento && seenDocs.has(numeroDocumento)) ||
          (email && seenEmails.has(email))
        ) {
          skipped++
          continue
        }
        if (numeroDocumento) seenDocs.add(numeroDocumento)
        if (email) seenEmails.add(email)
        filasUnicas.push(item)
      }

      // ----------------- PROCESAR FILAS ÚNICAS -----------------
      for (const item of filasUnicas) {
        const { fila, numeroDocumento, email } = item
        const tipoDocumento = fila['Tipo de Documento'] || ''
        const nombres = fila['Nombre'] || ''
        const apellidos = fila['Apellidos'] || ''
        const celular = fila['Celular'] || ''
        const estado = fila['Estado'] || 'activo'

        // Buscar existente en la base
        const existe = await Aprendiz.query()
          .useTransaction(trx)
          .where((q) => {
            if (numeroDocumento) q.where('numero_documento', numeroDocumento)
            if (email) q.orWhere('email', email)
          })
          .first()

        if (existe) {
          if (updateIfExists) {
            existe.merge({
              nombres: nombres || existe.nombres,
              apellidos: apellidos || existe.apellidos,
              celular: celular || existe.celular,
              estado: estado || existe.estado,
              tipo_documento: tipoDocumento || existe.tipo_documento,
              numero_documento: numeroDocumento || existe.numero_documento,
              email: email || existe.email,
              idgrupo: grupo.idgrupo || existe.idgrupo,
              idprograma_formacion: programa.idprograma_formacion || existe.idprograma_formacion,
              centro_formacion_idcentro_formacion:
                centroFormacionId || existe.centro_formacion_idcentro_formacion,
            })
            await existe.useTransaction(trx).save()
            updated++
          } else skipped++
          skippedAprendices.push({
            'Número de Documento': numeroDocumento,
            'Correo Electrónico': email,
            'Nombre': fila['Nombre'] || '',
            'Apellidos': fila['Apellidos'] || '',
          })
        } else {
          // Insertar nuevo
          const passwordTemporal =
            numeroDocumento || email || Math.random().toString(36).slice(2, 10)
          const hashedPassword = await bcrypt.hash(passwordTemporal, 10)
          const aprendizNuevo: any = {
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
          const model = new Aprendiz()
          model.merge(aprendizNuevo)
          await model.useTransaction(trx).save()
          inserted++
        }
      }

      await trx.commit()
      return response.ok({
        success: true,
        message: 'Importación procesada',
        inserted,
        updated,
        skipped,
        skippedAprendices,
      })
    } catch (error: any) {
      await trx.rollback()
      console.error('Error en importarAprendices:', error)
      return response
        .status(500)
        .json({ success: false, message: 'Error al importar aprendices', error: error.message })
    }
  }
}
