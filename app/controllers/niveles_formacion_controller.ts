import { HttpContext } from '@adonisjs/core/http'

import NivelFormacion from '#models/nivel_formacion'

export default class NivelFormacionController {
  async getAll({ response }: HttpContext) {
    try {
      const niveles = await NivelFormacion.query().preload('formacion')
      return response.status(200).json({ mensaje: 'Éxito', data: niveles })
    } catch (error) {
      return response.status(500).json({ mensaje: 'Error', error })
    }
  }

  async getById({ params, response }: HttpContext) {
    try {
      const nivel = await NivelFormacion.find(params.id)
      if (!nivel) return response.status(404).json({ mensaje: 'Nivel no encontrado' })
      await nivel.load('formacion')
      return response.status(200).json({ mensaje: 'Éxito', data: nivel })
    } catch (error) {
      return response.status(500).json({ mensaje: 'Error', error })
    }
  }

  async crear({ request, response }: HttpContext) {
    try {
      const data = request.only(['nivel_formacion'])
      const nivel = await NivelFormacion.create(data)
      return response.status(201).json({ mensaje: 'Éxito', data: nivel })
    } catch (error) {
      return response.status(500).json({ mensaje: 'Error', error })
    }
  }

  async actualizar({ params, request, response }: HttpContext) {
    try {
      const nivel = await NivelFormacion.find(params.id)
      if (!nivel) return response.status(404).json({ mensaje: 'Nivel no encontrado' })
      const data = request.only(['nivel_formacion'])
      nivel.merge(data)
      await nivel.save()
      return response.status(200).json({ mensaje: 'Éxito', data: nivel })
    } catch (error) {
      return response.status(500).json({ mensaje: 'Error', error })
    }
  }
}
