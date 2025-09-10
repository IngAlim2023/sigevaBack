import xlsx from 'xlsx'
import Grupo from '#models/grupo'
import { HttpContext } from '@adonisjs/core/http'

export default class GruposController {
  public static subirDesdeExcel = async ({ request, response }: HttpContext) => {
    try {
      const file = request.file('excel')
      if (!file) {
        return response.status(400).json({ error: 'No se subió ningún archivo' })
      }

      // Leer Excel
      const workbook = xlsx.readFile(file.tmpPath!)
      const sheetName = workbook.SheetNames[0]
      const data: { grupo: string; jornada: string }[] = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      )

      for (const row of data) {
        const { grupo, jornada } = row

        // Evitar duplicados
        const yaExiste = await Grupo.query().where('grupo', grupo).first()
        if (yaExiste) continue

        await Grupo.create({
          grupo,
          jornada,
        })
      }

      return response.json({ mensaje: 'Grupos importados correctamente' })
    } catch (error) {
      console.error('Error al importar Excel:', error)
      return response.status(500).json({ error: 'Error al importar datos' })
    }
  }
}
