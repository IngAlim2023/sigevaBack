/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContext } from '@adonisjs/core/http'
import Eleccione from '#models/eleccione'

export default class ReportesController {
  async filtrar({ request, response }: HttpContext) {
  try {
    const { idCentro_formacion, anio, idregional, ideleccion } = request.only([
      'idCentro_formacion',
      'anio',
      'idregional',
      'ideleccion',
    ])

    const query = Eleccione.query()

    if (idCentro_formacion) {
      query.where('idCentroFormacion', idCentro_formacion)
    }

    if (ideleccion) {
      query.where('ideleccion', ideleccion)
    }

    if (anio) {
      query.whereRaw('EXTRACT(YEAR FROM fecha_inicio) = ?', [anio])
    }

    if (idregional) {
      query.where('idregional', idregional)
    }

    const elecciones = await query
    return response.ok({
      message: 'Elecciones filtradas correctamente',
      elecciones,
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Error al filtrar elecciones',
      error: error.message,
    })
  }
}

}