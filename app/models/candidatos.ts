import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Eleccione from './eleccione.js'
import Aprendiz from './aprendiz.js'
import Votoxcandidato from './votoxcandidato.js'

export default class Candidatos extends BaseModel {
  public static table = 'candidatos'
  @column({ isPrimary: true })
  declare idcandidatos: number

  @column()
  declare nombres: string

  @column()
  declare ideleccion: number

  @column()
  declare idaprendiz: number

  @column()
  declare foto: string

  @column()
  declare propuesta: string

  @column()
  declare numero_tarjeton: string

  @column()
  declare idEleccion: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Eleccione, {
    foreignKey: 'ideleccion',
  })
  declare eleccion: BelongsTo<typeof Eleccione>

  @belongsTo(() => Aprendiz, {
    foreignKey: 'idaprendiz',
  })
  declare aprendiz: BelongsTo<typeof Aprendiz>

  @hasMany(() => Votoxcandidato, {
    foreignKey: 'idcandidatos',
  })
  declare departamento: HasMany<typeof Votoxcandidato>
}
