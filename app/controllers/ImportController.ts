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
      // Recibir archivo Excel y jornada desde frontend
      const file = request.file('excel')
      const { jornada } = request.only(['jornada'])

      if (!file) {
        return response.status(400).json({ message: 'Debes subir un archivo Excel' })
      }

      // Leer Excel
      const workbook = XLSX.read(file.tmpPath, { type: 'file' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data: any[] = XLSX.utils.sheet_to_json(sheet)

      // Buscar o crear perfil "Aprendiz"
      let perfil = await Perfil.query({ client: trx }).where('perfil', 'Aprendiz').first()
      if (!perfil) {
        perfil = await Perfil.create({ perfil: 'Aprendiz' }, { client: trx })
      }

      for (const fila of data) {
        const {
          'numero_documento': numeroDocumento,
          'Nombre': nombres,
          'Apellidos': apellidos,
          'Celular': celular,
          'Correo Electrónico': email,
          'Estado': estado,
          'ficha de caracterización': numeroGrupo,
          'Programa': nombrePrograma,
        } = fila

        // Verificar si ya existe el aprendiz
        const aprendizExist = await Aprendiz.query({ client: trx })
          .where('email', email)
          .orWhere('numero_documento', numeroDocumento)
          .first()
        if (aprendizExist) continue // saltar si ya existe

        // Buscar o crear grupo
        let grupo = await Grupo.query({ client: trx }).where('grupo', numeroGrupo).first()
        if (!grupo) {
          grupo = await Grupo.create({ grupo: numeroGrupo, jornada }, { client: trx })
        }

        // Buscar o crear programa
        let programa = await ProgramaFormacion.query({ client: trx })
          .where('programa', nombrePrograma)
          .first()
        if (!programa) {
          programa = await ProgramaFormacion.create(
            {
              programa: nombrePrograma,
              // Puedes agregar otros campos como codigo_programa, version, duracion si los tienes
            },
            { client: trx }
          )
        }

        // Crear contraseña temporal y hash
        const passwordTemporal = Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(passwordTemporal, 10)

        // Crear aprendiz con grupo y programa asignados
        await Aprendiz.create(
          {
            perfil_idperfil: perfil.idperfil,
            numero_documento: numeroDocumento,
            nombres,
            apellidos,
            celular,
            email,
            estado,
            password: hashedPassword,
            idgrupo: grupo.idgrupo,
            idprograma_formacion: programa.idprograma_formacion,
          },
          { client: trx }
        )
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
