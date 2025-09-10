import ProgramaFormacion from '#models/programa_formacion'

export class ProgramaFormacionService {
  /**
   * Obtener todos los programas de formación
   */
  async getAll() {
    return await ProgramaFormacion.all()
  }

  /**
   * Crear un nuevo programa
   */
  async create(data: Partial<ProgramaFormacion>) {
    return await ProgramaFormacion.create(data)
  }

  /**
   * Actualizar un programa existente
   */
  async update(id: number, data: Partial<ProgramaFormacion>) {
    const programa = await ProgramaFormacion.findOrFail(id)
    programa.merge(data)
    await programa.save()
    return programa
  }
}
