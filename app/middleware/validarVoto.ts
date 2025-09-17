// app/Middleware/ValidarVotoUnico.ts
import { HttpContext } from '@adonisjs/core/http'
import Votoxcandidato from '#models/votoxcandidato'

export default class ValidarVotoUnico {
  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    // 1. Extraer datos del body
    const idAprendiz = request.input('idaprendiz')
    const idEleccion = request.input('ideleccion') 

    if (!idAprendiz || !idEleccion) {
      return response.status(200).json({
        message: 'Debes enviar idaprendiz e ideleccion en la petición',
      })
    }

    // 2. Buscar si ya existe un voto de ese aprendiz en esa elección
    const votoExistente = await Votoxcandidato
      .query()
      .where('idaprendiz', idAprendiz)
      .preload('candidato', (candidatoQuery) => {
        candidatoQuery.where('ideleccion', idEleccion) 
      })
    console.log("votos"+votoExistente)
    // 3. Verificar si efectivamente tiene algún voto en esa elección
    const yaVoto = votoExistente.some((v) => v.candidato?.ideleccion === idEleccion)
    console.log("ya voto?"+yaVoto)

    if (yaVoto) {
      return response.status(200).json({succes:false,
        message: `Ya realizaste un voto en esta elección.`,
      })
    }

    // 4. Continuar si no existe voto previo
    await next()
  }
}
