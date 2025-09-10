import { ProgramaFormacionService } from '#services/programas_formacion_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProgramasFormacionController {
  constructor(private programaFormacionService: ProgramaFormacionService) {}

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const programas = await this.programaFormacionService.getAll()
    return response.ok(programas)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only([
      'idnivel_formacion',
      'idarea_tematica',
      'programa',
      'codigo_programa',
      'version',
      'duracion',
    ])

    const programa = await this.programaFormacionService.create(data)
    return response.created(programa)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const data = request.only([
      'idnivel_formacion',
      'idarea_tematica',
      'programa',
      'codigo_programa',
      'version',
      'duracion',
    ])

    const programa = await this.programaFormacionService.update(params.id, data)
    return response.ok(programa)
  }
}
