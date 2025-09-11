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

  static async getAllCandidatosByIdEleccion(ideleccion: number) {
    const candidatos = await Candidatos.query()
      .where('ideleccion', ideleccion)
      .orderByRaw('RANDOM()')
    return candidatos
  }

  static async updateCandidatos(
    idcandidatos: number,
    data: Partial<CreateCandidatoDTO>,
    localFilePath?: string | null
  ) {
    const trx = await db.transaction()
    try {
      const candidato = await Candidatos.findOrFail(idcandidatos, { client: trx })

      if (localFilePath) {
        const { url } = await CloudinaryService.uploadImage(localFilePath)
        candidato.foto = url
      }

      if (data.foto_url) {
        candidato.foto = data.foto_url
      }

      if (data.nombres) candidato.nombres = data.nombres
      if (data.ideleccion) candidato.ideleccion = data.ideleccion
      if (data.idaprendiz) candidato.idaprendiz = data.idaprendiz
      if (data.propuesta) candidato.propuesta = data.propuesta
      if (data.numero_tarjeton) candidato.numero_tarjeton = data.numero_tarjeton

      await candidato.save()
      await trx.commit()

      return candidato
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  static async deleteCandidato(idcandidatos: number) {
    const trx = await db.transaction()
    try {
      const candidato = await Candidatos.findOrFail(idcandidatos, { client: trx })

      // 🔴 Opcional: eliminar en Cloudinary si guardaste el public_id
      if (candidato.foto) {
        await CloudinaryService.delete(candidato.foto)
      }

      await candidato.delete()
      await trx.commit()

      return { message: 'Candidato eliminado correctamente' }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  static async getAllCandidatos() {
    const candidatos = await Candidatos.query().orderBy('idcandidatos', 'asc')
    return candidatos
  }
}
