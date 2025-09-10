import { BaseModel, column, hasMany, belongsTo} from '@adonisjs/lucid/orm'
import Votoxcandidato from './votoxcandidato.js'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Eleccione from './eleccione.js'

export default class Candidatos extends BaseModel {
  public static table = 'candidatos'
  @column({ isPrimary: true })
  declare idcandidatos: number

  @column()
  declare nombres: string

  @column()
  declare ideleccion: number

  @column()
  declare idparendiz: number

  @column()
  declare foto: string

  @column()
  declare propuesta: string

  @column()
  declare numero_tarjeton: number
}
