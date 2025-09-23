import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import Eleccione from '#models/eleccione'

export default class GeneracionReporteController {
  // GET /reporte/eleccion/:id
  public async reporteEleccion({ params, response }: HttpContext) {
    const idEleccion = Number(params.id)

    if (Number.isNaN(idEleccion)) {
      return response.badRequest({ message: 'Parámetro id inválido' })
    }

    try {
      // 1) Información de la elección
      const eleccion = await Eleccione.query()
        .where('ideleccion', idEleccion)
        .first()

      if (!eleccion) {
        return response.notFound({ message: 'Elección no encontrada' })
      }

      // 2) Votos por candidato de la elección (incluye candidatos con 0 votos)
      //    Nota: el nombre se toma del aprendiz asociado al candidato
      const candidatosConVotos = await Database.from('candidatos')
        .leftJoin('votoxcandidato', 'candidatos.idcandidatos', 'votoxcandidato.idcandidatos')
        .leftJoin('aprendiz', 'candidatos.idaprendiz', 'aprendiz.idaprendiz')
        .where('candidatos.ideleccion', idEleccion)
        .groupBy(
          'candidatos.idcandidatos',
          'candidatos.numero_tarjeton',
          'candidatos.foto',
          'candidatos.propuesta',
          'aprendiz.nombres',
          'aprendiz.apellidos'
        )
        .select(
          'candidatos.idcandidatos as idcandidatos',
          'candidatos.numero_tarjeton as numero_tarjeton',
          'candidatos.foto as foto',
          'candidatos.propuesta as propuesta',
          Database.raw(`COALESCE(aprendiz.nombres, '') || ' ' || COALESCE(aprendiz.apellidos, '') as nombres`)
        )
        .sum({ votos: 'votoxcandidato.contador' })

      // 3) Total de participantes (aprendices únicos que votaron en esta elección)
      const participantesRow = await Database.from('votoxcandidato')
        .join('candidatos', 'votoxcandidato.idcandidatos', 'candidatos.idcandidatos')
        .where('candidatos.ideleccion', idEleccion)
        .countDistinct({ total: 'votoxcandidato.idaprendiz' })
        .first()

      const totalParticipantes = Number(participantesRow?.total ?? 0)

      // 4) Determinar ganador (o empate)
      let ganador: any = null
      if (candidatosConVotos.length > 0) {
        const maxVotos = Math.max(
          ...candidatosConVotos.map((c: any) => Number(c.votos ?? 0))
        )
        const top = candidatosConVotos.filter((c: any) => Number(c.votos ?? 0) === maxVotos)

        if (top.length === 1) {
          ganador = top[0]
        } else {
          ganador = { empate: true, candidatos: top }
        }
      }

      return response.ok({
        eleccion: {
          id: eleccion.ideleccion,
          nombre: eleccion.nombre,
          jornada: eleccion.jornada,
          fecha_inicio: eleccion.fecha_inicio,
          fecha_fin: eleccion.fecha_fin,
          hora_inicio: eleccion.hora_inicio,
          hora_fin: eleccion.hora_fin,
          idcentro_formacion: eleccion.idcentro_formacion,
        },
        totalParticipantes,
        candidatos: candidatosConVotos.map((c: any) => ({
          idcandidatos: c.idcandidatos,
          nombres: c.nombres,
          numero_tarjeton: c.numero_tarjeton,
          foto: c.foto,
          propuesta: c.propuesta,
          votos: Number(c.votos ?? 0),
        })),
        ganador,
      })
    } catch (error) {
      console.error('Error generando reporte:', error)
      return response.internalServerError({ message: 'Error generando el reporte' })
    }
  }
}
