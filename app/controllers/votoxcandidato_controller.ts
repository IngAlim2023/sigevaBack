import { HttpContext } from '@adonisjs/core/http'
import Votoxcandidato from '#models/votoxcandidato'



export default class VotoxcandidatoController {

    async crear({ request, response }: HttpContext) {
        try {
            const data = request.only(['idcandidatos', 'idaprendiz', 'contador'])
            const votico = await Votoxcandidato.create(data)
            return response.status(201).json({ mensaje: "Éxito" })
        } catch (error) {
            return response.status(500).json({ mensaje: "Error", error: error.message })
        }
    }

    async getAll({ response }: HttpContext) {
        try {
            const voticos = await Votoxcandidato.all()
            return response.status(200).json({ mensaje: "Éxito", data: voticos })
        } catch (error) {
            return response.status(500).json({ mensaje: "Error", error: error.message })
        }
    }

    public async getYears({ response }: HttpContext) {
    try {
      const voticos = await Votoxcandidato
        .query()
        .join('candidatos', 'votoxcandidato.idcandidatos', 'candidatos.idcandidatos')
        .join('elecciones', 'candidatos.ideleccion', 'elecciones.ideleccion')
        .select('votoxcandidato.*', 'elecciones.fecha_fin')

return response.ok(voticos)
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Error al traer votos', error: error.message })
    }
  }
}