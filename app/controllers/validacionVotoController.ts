import type { HttpContext } from '@adonisjs/core/http'
import ValidacionVoto from '#models/validacion_voto'
import vine from '@vinejs/vine'

export default class ValidacionVotoController {
  
  /**
   * Obtener todas las validaciones de voto
   */
  async index({ response }: HttpContext) {
    try {
      const validaciones = await ValidacionVoto.query()
        .preload('aprendiz')
        .preload('eleccion')
        .orderBy('id', 'desc')
      
      return response.status(200).json({
        message: 'Validaciones obtenidas exitosamente',
        data: validaciones
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error al obtener las validaciones',
        error: error.message
      })
    }
  }

  /**
   * Crear una nueva validación de voto
   */
  async store({ request, response }: HttpContext) {
    try {
      // Validación de datos
      const validator = vine.compile(
        vine.object({
          codigo: vine.string().minLength(1),
          aprendiz_idAprendiz: vine.number().positive(),
          elecciones_idEleccion: vine.number().positive()
        })
      )

      const data = await request.validateUsing(validator)

      // Verificar si ya existe una validación con el mismo código
      const existeValidacion = await ValidacionVoto.findBy('codigo', data.codigo)
      if (existeValidacion) {
        return response.status(400).json({
          message: 'Ya existe una validación con este código'
        })
      }

      // Crear la validación
      const validacion = await ValidacionVoto.create(data)

      // Cargar las relaciones
      await validacion.load('aprendiz')
      await validacion.load('eleccion')

      return response.status(201).json({
        message: 'Validación creada exitosamente',
        data: validacion
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error al crear la validación',
        error: error.message
      })
    }
  }

  /**
   * Obtener una validación específica
   */
  async show({ params, response }: HttpContext) {
    try {
      const validacion = await ValidacionVoto.query()
        .where('id', params.id)
        .preload('aprendiz')
        .preload('eleccion')
        .first()

      if (!validacion) {
        return response.status(404).json({
          message: 'Validación no encontrada'
        })
      }

      return response.status(200).json({
        message: 'Validación obtenida exitosamente',
        data: validacion
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error al obtener la validación',
        error: error.message
      })
    }
  }
}