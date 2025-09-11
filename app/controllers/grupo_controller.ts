import { HttpContext } from '@adonisjs/core/http'
import Grupo from '#models/grupo'

export default class GrupoController {
  async getAll({ response }: HttpContext) {
    try {
      const grupos = await Grupo.query().preload('aprendices')
      return response.status(200).json({ mensaje: 'Éxito', data: grupos })
    } catch (error) {
      return response.status(500).json({ mensaje: 'Error', error })
    }
  }

  async getById({ params, response }: HttpContext) {
    try {
      const grupo = await Grupo.find(params.id)
      if (!grupo) return response.status(404).json({ mensaje: 'Grupo no encontrado' })
      await grupo.load('aprendices')
      return response.status(200).json({ mensaje: 'Éxito', data: grupo })
    } catch (error) {
      return response.status(500).json({ mensaje: 'Error', error })
    }
  }

  async crear({ request, response }: HttpContext) {
    try {
      const data = request.only(['grupo', 'jornada'])
      const grupo = await Grupo.create(data)
      return response.status(201).json({ mensaje: 'Éxito', data: grupo })
    } catch (error) {
      return response.status(500).json({ mensaje: 'Error', error })
    }
  }

  async actualizar({ params, request, response }: HttpContext) {
    try {
      const grupo = await Grupo.find(params.id)
      if (!grupo) return response.status(404).json({ mensaje: 'Grupo no encontrado' })
      const data = request.only(['grupo', 'jornada'])
      grupo.merge(data)
      await grupo.save()
      return response.status(200).json({ mensaje: 'Éxito', data: grupo })
    } catch (error) {
      return response.status(500).json({ mensaje: 'Error', error })
    }
  }
}
