import db from '@adonisjs/lucid/services/db'
import CloudinaryService from '#services/claudinary_service'
import Candidatos from '#models/candidatos' // Ajusta a tu ruta real

type CreateCandidatoDTO = {
  nombres: string
  ideleccion: number
  idaprendiz: number
  propuesta: string
  numero_tarjeton: number
  foto_url?: string | null
}

export default class CandidatosService {
  static async checkDuplicateTarjeton(ideleccion: number, numero_tarjeton: number) {
    const exists = await Candidatos.query()
      .where('ideleccion', ideleccion)
      .andWhere('numero_tarjeton', numero_tarjeton)
      .first()

    if (exists) {
      throw new Error('Ya existe un candidato con ese número de tarjetón en esta elección')
    }
  }

  static async createWithOptionalUpload(data: CreateCandidatoDTO, localFilePath?: string | null) {
    await this.checkDuplicateTarjeton(data.ideleccion, data.numero_tarjeton)

    const trx = await db.transaction()
    try {
      let fotoUrl = data.foto_url ?? null

      if (localFilePath) {
        const { url } = await CloudinaryService.uploadImage(localFilePath)
        fotoUrl = url
      }

      const candidato = await Candidatos.create(
        {
          nombres: data.nombres,
          ideleccion: data.ideleccion,
          idaprendiz: data.idaprendiz,
          propuesta: data.propuesta,
          numero_tarjeton: data.numero_tarjeton,
          foto: fotoUrl ?? '',
        },
        { client: trx }
      )

      await trx.commit()
      return candidato
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
