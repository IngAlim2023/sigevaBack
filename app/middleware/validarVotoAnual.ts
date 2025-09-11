// app/Middleware/ValidarVotoAnual.ts
import { HttpContext } from '@adonisjs/core/http'
import Votoxcandidato from '#models/votoxcandidato'

export default class ValidarVotoAnual {
  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    // 1. Sacamos el idAprendiz del body del POST
    const idAprendiz = request.input('idaprendiz')

    if (!idAprendiz) {
      return response.badRequest({
        message: 'Debes enviar el idaprendiz en la petición',
      })
    }

    // 2. Consulta con preload → traemos elecciones de sus votos
    const voticos = await Votoxcandidato
        .query()
        .where('idaprendiz', idAprendiz)
        .preload('candidato', (candidatoQuery) => {
            candidatoQuery.preload('eleccion')
     })

    // 3. Extraemos años en los que ya votó
    const añosVotados = voticos.map((v) => {
      return v.candidato.eleccion.fecha_fin.getFullYear()
    })

    // 4. Año actual
    const añoActual = new Date().getFullYear()

    // 5. Validación
    if (añosVotados.includes(añoActual)) {
      return response.badRequest({
        message: `Ya realizaste un voto en el año ${añoActual}`,
      })
    }

    // 6. Si pasa la validación, continúa al controlador
    await next()
  }
}
