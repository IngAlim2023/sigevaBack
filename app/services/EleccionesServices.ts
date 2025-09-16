/* eslint-disable @unicorn/filename-case */
/* eslint-disable prettier/prettier */

import Eleccione from "#models/eleccione"

export default class EleccionService {
  async listarPorCentro(idcentro_formacion: any) {
      const elecciones = await Eleccione.query()
      .where('idcentro_formacion', idcentro_formacion)
      .preload('centro')
      .preload('candidato', (candidatoQuery) => {
        candidatoQuery.preload('aprendiz', (aprendizQuery) => {
          aprendizQuery
            .preload('grupo')
            .preload('programa')
        })
      })

    return elecciones
  }
  
  async eleccionesAactivas() {
    const today = new Date()

    return await Eleccione.query()
    .where('fecha_fin', '>=', today)
  }


}
