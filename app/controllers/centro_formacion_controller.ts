import type { HttpContext } from '@adonisjs/core/http'
import CentroFormacion from '#models/centro_formacion'

export default class CentroFormacionController {
  
  async index({ response }: HttpContext) {
    try {
      const centro = await CentroFormacion.all()
      return response.status(200).json({
        success: true,
        data: centro,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al obtener los centros de formación',
        error: error.message,
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const {
        idRegionales,
        centro_formacioncol,
        idmunicipios,
        direccion,
        telefono,
        correo,
        subdirector,
        correosubdirector,
      } = request.body()

      const centro = await CentroFormacion.create({
        idRegionales,
        centro_formacioncol,
        idmunicipios,
        direccion,
        telefono,
        correo,
        subdirector,
        correosubdirector,
      })

      console.log(centro)

      return response.status(201).json({
        success: true,
        message: 'Centro de formación creado exitosamente',
        data: centro,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al crear centro de formación',
        error: error.message,
      })
    }
  }

  async update({ request, response, params }: HttpContext) {
    try {
      const centroId = params.id
      const centro = await CentroFormacion.find(centroId)

      if (!centro) {
        return response.status(404).json({
          success: false,
          message: 'Centro de formación no encontrado',
        })
      }

      const {
        idRegionales,
        centro_formacioncol,
        idmunicipios,
        direccion,
        telefono,
        correo,
        subdirector,
        correosubdirector,
      } = request.body()

      centro.idRegionales = idRegionales ?? centro.idRegionales
      centro.centro_formacioncol = centro_formacioncol ?? centro.centro_formacioncol
      centro.idmunicipios = idmunicipios ?? centro.idmunicipios
      centro.direccion = direccion ?? centro.direccion
      centro.telefono = telefono ?? centro.telefono
      centro.correo = correo ?? centro.correo
      centro.subdirector = subdirector ?? centro.subdirector
      centro.correosubdirector = correosubdirector ?? centro.correosubdirector

      await centro.save()

      return response.status(200).json({
        success: true,
        message: 'Centro de formación actualizado exitosamente',
        data: centro,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al actualizar centro de formación',
        error: error.message,
      })
    }
  }
}
