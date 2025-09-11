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

export default class ImportExcelController {
  // Método para importar aprendices
  async importarAprendices({ request, response }: HttpContext) {
    const trx = await db.transaction()

    try {
      const file = request.file('excel')
      const { jornada } = request.only(['jornada'])

      if (!file) {
        return response.status(400).json({ message: 'Debes subir un archivo Excel' })
      }

      // Leer Excel
      const workbook = XLSX.read(file.tmpPath, { type: 'file' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]

      const fichaCelda = sheet['C2']?.v?.toString().trim() || ''
      console.log('Contenido de B2:', fichaCelda)

      // Reemplazamos guion largo por guion normal
      const fichaLimpia = fichaCelda.replace(/–/g, '-')
      const partes = fichaLimpia.split(' - ')

      // Asignamos con fallback
      const numeroGrupo = partes[0]?.trim() || ''
      const nombrePrograma = partes[1]?.trim() || ''

      console.log('numeroGrupo:', numeroGrupo)
      console.log('nombrePrograma:', nombrePrograma)

      if (!numeroGrupo || !nombrePrograma) {
        return response.status(400).json({
          message: 'No se encontró la ficha de caracterización o el programa en el Excel',
        })
      }

      const data: any[] = XLSX.utils.sheet_to_json(sheet, { range: 4, defval: '' })

      // Perfil "Aprendiz"
      let perfil = await Perfil.query().where('perfil', 'Aprendiz').first()
      if (!perfil) {
        perfil = new Perfil()
        perfil.perfil = 'Aprendiz'
        await perfil.useTransaction(trx).save()
      }

      // Nivel de formación predeterminado
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
        // Merge campos faltantes del programa
        programa.merge({
          idnivel_formacion: programa.idnivel_formacion || nivel.idnivel_formacion,
          idarea_tematica: programa.idarea_tematica || AREA_SOFTWARE_ID,
          codigo_programa: programa.codigo_programa || 'N/A',
          version: programa.version || '1.0',
          duracion: programa.duracion || 0,
        })
        await programa.useTransaction(trx).save()
      }

      // Iterar sobre cada aprendiz
      for (const fila of data) {
        const {
          'Tipo de Documento': tipoDocumento,
          'Número de Documento': numeroDocumento,
          'Nombre': nombres,
          'Apellidos': apellidos,
          'Celular': celular,
          'Correo Electrónico': email,
          'Estado': estado,
          ...otrosCampos
        } = fila

        if (!numeroDocumento || !email) {
          console.warn('Fila ignorada: faltan datos', fila)
          continue
        }

        let aprendiz = await Aprendiz.query()
          .where('email', email)
          .orWhere('numero_documento', numeroDocumento)
          .first()

        if (aprendiz) {
          // Merge: completar solo campos faltantes, incluyendo campos extras
          const aprendizAny = aprendiz as any
          Object.keys(otrosCampos).forEach((key) => {
            if (!aprendizAny[key] && otrosCampos[key]) {
              aprendizAny[key] = otrosCampos[key]
            }
          })

          // Campos principales
          aprendizAny.nombres = aprendizAny.nombres || nombres
          aprendizAny.apellidos = aprendizAny.apellidos || apellidos
          aprendizAny.celular = aprendizAny.celular || celular
          aprendizAny.estado = aprendizAny.estado || estado
          aprendizAny.tipo_documento = aprendizAny.tipo_documento || tipoDocumento
          aprendizAny.idgrupo = aprendizAny.idgrupo || grupo.idgrupo
          aprendizAny.idprograma_formacion =
            aprendizAny.idprograma_formacion || programa.idprograma_formacion

          await aprendizAny.useTransaction(trx).save()
        } else {
          const passwordTemporal = numeroDocumento
          const hashedPassword = await bcrypt.hash(passwordTemporal, 10)

          const aprendizNuevo = new Aprendiz()
          Object.assign(aprendizNuevo, {
            perfil_idperfil: perfil.idperfil,
            tipo_documento: tipoDocumento,
            numero_documento: numeroDocumento,
            nombres,
            apellidos,
            celular,
            email,
            estado,
            password: hashedPassword,
            idgrupo: grupo.idgrupo,
            idprograma_formacion: programa.idprograma_formacion,
            ...otrosCampos,
          })
          await aprendizNuevo.useTransaction(trx).save()
        }
      }

      await trx.commit()
      return response.ok({ message: 'Aprendices importados con éxito' })
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({
        message: 'Error al importar aprendices',
        error: error.message,
      })
    }
  }

  // Dentro de ImportExcelController

  async importarProgramas({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      // Recibir archivo Excel
      const file = request.file('excel')
      if (!file) {
        return response.status(400).json({ message: 'Debes subir un archivo Excel' })
      }

      // Leer Excel
      const workbook = XLSX.read(file.tmpPath, { type: 'file' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data: any[] = XLSX.utils.sheet_to_json(sheet)

      // Iterar filas
      for (const fila of data) {
        const { Programa, CodigoPrograma, Version, Duracion, IdNivelFormacion, IdAreaTematica } =
          fila

        // Verificar si ya existe el programa
        let programa = await ProgramaFormacion.query({ client: trx })
          .where('codigo_programa', CodigoPrograma)
          .first()
        if (programa) continue // saltar si ya existe

        // Crear programa
        await ProgramaFormacion.create(
          {
            programa: Programa,
            codigo_programa: CodigoPrograma,
            version: Version,
            duracion: Duracion,
            idnivel_formacion: IdNivelFormacion,
            idarea_tematica: IdAreaTematica,
          },
          { client: trx }
        )
      }

      await trx.commit()
      return response.ok({ message: 'Programas de formación importados con éxito' })
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response
        .status(500)
        .json({ message: 'Error al importar programas', error: error.message })
    }
  }
  // Dentro de ImportExcelController.ts

  async importarGrupos({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      // Recibir archivo Excel
      const file = request.file('excel')
      if (!file) {
        return response.status(400).json({ message: 'Debes subir un archivo Excel' })
      }

      // Leer Excel
      const workbook = XLSX.read(file.tmpPath, { type: 'file' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data: any[] = XLSX.utils.sheet_to_json(sheet)

      // Iterar filas
      for (const fila of data) {
        const { Grupo: nombreGrupo, Jornada } = fila

        // Verificar si ya existe el grupo
        let grupo = await Grupo.query({ client: trx }).where('grupo', nombreGrupo).first()
        if (grupo) continue // saltar si ya existe

        // Crear grupo
        await Grupo.create(
          {
            grupo: nombreGrupo,
            jornada: Jornada || null,
          },
          { client: trx }
        )
      }

      await trx.commit()
      return response.ok({ message: 'Grupos importados con éxito' })
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response
        .status(500)
        .json({ message: 'Error al importar grupos', error: error.message })
    }
  }
  // Dentro de ImportExcelController.ts

  async importarNiveles({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      // Recibir archivo Excel
      const file = request.file('excel')
      if (!file) {
        return response.status(400).json({ message: 'Debes subir un archivo Excel' })
      }

      // Leer Excel
      const workbook = XLSX.read(file.tmpPath, { type: 'file' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data: any[] = XLSX.utils.sheet_to_json(sheet)

      // Iterar filas
      for (const fila of data) {
        const { IdNivelFormacion, NivelFormacion: nombreNivel } = fila

        // Verificar si ya existe el nivel
        let nivel = await NivelFormacion.query({ client: trx })
          .where('idnivel_formacion', IdNivelFormacion)
          .first()
        if (nivel) continue // saltar si ya existe

        // Crear nivel de formación
        await NivelFormacion.create(
          {
            idnivel_formacion: IdNivelFormacion,
            nivel_formacion: nombreNivel,
          },
          { client: trx }
        )
      }

      await trx.commit()
      return response.ok({ message: 'Niveles de formación importados con éxito' })
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response
        .status(500)
        .json({ message: 'Error al importar niveles', error: error.message })
    }
  }
  // Dentro de ImportExcelController.ts

  async importarPerfiles({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      // Recibir archivo Excel
      const file = request.file('excel')
      if (!file) {
        return response.status(400).json({ message: 'Debes subir un archivo Excel' })
      }

      // Leer Excel
      const workbook = XLSX.read(file.tmpPath, { type: 'file' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data: any[] = XLSX.utils.sheet_to_json(sheet)

      // Iterar filas
      for (const fila of data) {
        const { IdPerfil, Perfil: nombrePerfil } = fila

        // Verificar si ya existe el perfil
        let perfilExist = await Perfil.query({ client: trx }).where('idperfil', IdPerfil).first()
        if (perfilExist) continue // saltar si ya existe

        // Crear perfil
        await Perfil.create(
          {
            idperfil: IdPerfil,
            perfil: nombrePerfil,
          },
          { client: trx }
        )
      }

      await trx.commit()
      return response.ok({ message: 'Perfiles importados con éxito' })
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response
        .status(500)
        .json({ message: 'Error al importar perfiles', error: error.message })
    }
  }
}
