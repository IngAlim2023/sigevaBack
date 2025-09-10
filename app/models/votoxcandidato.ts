import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Votoxcandidato extends BaseModel {
  public static table = 'votoxcandidato'
  @column({ isPrimary: true })
  declare idvotoxcandidato: number

  @column()
  declare idcandidatos: number

  @column()
  declare idaprendiz: number

  @column()
  declare contador: number

  @belongsTo(() => , {foreignKey: 'iddepartamentos',})
  declare municipio: BelongsTo<typeof Departamento>
}