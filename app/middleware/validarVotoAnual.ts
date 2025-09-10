// // app/Middleware/ValidarVotoAnual.ts
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Aprendiz from '#models/aprendiz'

// export default class ValidarVotoAnual {
//   public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
//     const aprendizId = auth.user?.idAprendiz
//     if (!aprendizId) {
//       return response.unauthorized({ message: 'No autenticado' })
//     }

//     // Traemos el aprendiz con sus votos (preload)
//     const aprendiz = await Aprendiz.query()
//       .where('idAprendiz', aprendizId)
//       .preload('votosXCandidato')
//       .firstOrFail()

//     // Año actual del voto que intenta registrar
//     const añoVotoNuevo = new Date().getFullYear()

//     // Revisar si ya votó en este mismo año
//     const yaVotoEsteAño = aprendiz.votosXCandidato.some((v) => {
//       return v.createdAt.year() === añoVotoNuevo
//     })

//     if (yaVotoEsteAño) {
//       return response.badRequest({
//         message: `Ya realizaste un voto en el año ${añoVotoNuevo}`,
//       })
//     }

//     // Si no ha votado este año, continuamos
//     await next()
//   }
// }
