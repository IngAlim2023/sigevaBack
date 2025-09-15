import type { HttpContext } from '@adonisjs/core/http'
import { storeCandidatoValidator } from '#validators/store_candidato_validator'
import CandidatosService from '#services/candidatos_service'

export default class CandidatosController {
  public async store({ request, response }: HttpContext) {
    // 1) Validar datos básicos con VineJS
    const payload = await request.validateUsing(storeCandidatoValidator)

    // 2) Leer archivo opcional (multipart/form-data)
    const fotoFile = request.file('foto', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    try {
      const candidato = await CandidatosService.createWithOptionalUpload(
        {
          nombres: payload.nombres ?? 'Candidato',
          ideleccion: payload.ideleccion,
          idaprendiz: payload.idaprendiz,
          propuesta: payload.propuesta,
          numero_tarjeton: payload.numero_tarjeton,
          foto_url: payload.foto_url ?? null,
        },
        fotoFile?.tmpPath ?? null
      )

      return response.created({
        message: 'Candidato registrado correctamente',
        data: candidato,
      })
    } catch (error: any) {
      return response.badRequest({
        message: error?.message ?? 'Error al registrar candidato',
      })
    }
  }

  public async getByEleccion({ params, response }: HttpContext) {
    try {
      const ideleccion = Number(params.ideleccion)
      if (Number.isNaN(Number(ideleccion))) {
        return response.badRequest({
          message: 'El parámetro ideleccion debe ser un número válido',
        })
      }

      const candidatos = await CandidatosService.getAllCandidatosByIdEleccion(Number(ideleccion))

      return response.ok({
        message: 'Candidatos obtenidos correctamente',
        data: candidatos,
      })
    } catch (error: any) {
      return response.badRequest({
        message: error?.message ?? 'Error al obtener candidatos',
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const idcandidatos = Number(params.id)
      if (Number.isNaN(idcandidatos)) {
        return response.badRequest({ message: 'El parámetro id debe ser numérico' })
      }

      const fotoFile = request.file('foto', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      const data = request.only([
        'nombres',
        'ideleccion',
        'idaprendiz',
        'propuesta',
        'numero_tarjeton',
        'foto_url',
      ])

      const candidato = await CandidatosService.updateCandidatos(
        idcandidatos,
        data,
        fotoFile?.tmpPath ?? null
      )

      return response.ok({
        message: 'Candidato actualizado correctamente',
        data: candidato,
      })
    } catch (error: any) {
      return response.badRequest({
        message: error?.message ?? 'Error al actualizar candidato',
      })
    }
  }

  public async delete({ params, response }: HttpContext) {
    try {
      const idcandidatos = Number(params.id)
      if (Number.isNaN(idcandidatos)) {
        return response.badRequest({ message: 'El parámetro id debe ser numérico' })
      }

      const result = await CandidatosService.deleteCandidato(idcandidatos)
      return response.ok(result)
    } catch (error: any) {
      return response.badRequest({
        message: error?.message ?? 'Error al eliminar candidato',
      })
    }
  }

  public async show({ response }: HttpContext) {
    try {
      const candidatos = await CandidatosService.getAllCandidatos()

      return response.ok({
        message: 'Candidatos obtenidos correctamente',
        data: candidatos,
      })
    } catch (error: any) {
      return response.badRequest({
        message: error?.message ?? 'Error al obtener candidatos',
      })
    }
  }
}
