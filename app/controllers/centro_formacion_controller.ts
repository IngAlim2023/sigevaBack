import type { HttpContext } from '@adonisjs/core/http'
import CentroFormacion from '#models/centro_formacion'
import Regional from '#models/regionale'
import Municipio from '#models/municipio'

export default class CentroFormacionController {
  

  async obtiene({ response }: HttpContext) {
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

  // Crear nuevo centro de formación
  async crear({ request, response }: HttpContext) {
    try {
      const {
        idregional,
        centro_formacioncol,
        idmunicipios,
        direccion,
        telefono,
        correo,
        subdirector,
        correosubdirector,
      } = request.body()

      // Validar existencia de idregional
      const regional = await Regional.find(idregional)
      if (!regional) {
        return response.status(400).json({
          success: false,
          message: 'El idregional proporcionado no existe',
        })
      }

      // Validar existencia de idmunicipios
      const municipio = await Municipio.find(idmunicipios)
      if (!municipio) {
        return response.status(400).json({
          success: false,
          message: 'El idmunicipios proporcionado no existe',
        })
      }

      // Crear centro de formación (sin idcentro_formacion)
      const centro = await CentroFormacion.create({
        idregional,
        centro_formacioncol,
        idmunicipios,
        direccion,
        telefono,
        correo,
        subdirector,
        correosubdirector,
      })

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

  // Actualizar centro de formación existente
  async actualiza({ request, response, params }: HttpContext) {
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
        idregional,
        centro_formacioncol,
        idmunicipios,
        direccion,
        telefono,
        correo,
        subdirector,
        correosubdirector,
      } = request.body()

      // Validar si se está actualizando idregional
      if (idregional) {
        const regional = await Regional.find(idregional)
        if (!regional) {
          return response.status(400).json({
            success: false,
            message: 'El idregional proporcionado no existe',
          })
        }
        centro.idregional = idregional
      }

      // Validar si se está actualizando idmunicipios
      if (idmunicipios) {
        const municipio = await Municipio.find(idmunicipios)
        if (!municipio) {
          return response.status(400).json({
            success: false,
            message: 'El idmunicipios proporcionado no existe',
          })
        }
        centro.idmunicipios = idmunicipios
      }

      // Actualizar el resto de campos si se proporcionan
      centro.centro_formacioncol = centro_formacioncol ?? centro.centro_formacioncol
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
