/* eslint-disable @unicorn/filename-case */
/* eslint-disable prettier/prettier */

import Eleccione from "#models/eleccione"

export default class EleccionService {
  
  async eleccionesAactivas() {
    const today = new Date()

    return await Eleccione.query()
    .where('fecha_fin', '>=', today)
  }
}
