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
          nombres: payload.nombres,
          ideleccion: payload.ideleccion,
          idaprendiz: payload.idaprendiz,
          propuesta: payload.propuesta,
          numero_tarjeton: payload.numero_tarjeton,
          foto_url: payload.foto_url ?? null,
        },
        fotoFile?.tmpPath ?? null // si llega archivo, se sube a Cloudinary
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
}
