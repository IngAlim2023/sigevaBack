import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ProgramaFormacion extends BaseModel {
  public static table = 'programa_formacion'

  @column({ isPrimary: true })
  declare idprograma_formacion: number

  @column()
  declare idnivel_formacion: number

  @column()
  declare idarea_tematica: number

  @column()
  declare programa: string

  @column()
  declare codigo_programa: number

  @column()
  declare version: string

  @column()
  declare duracion: number
}
