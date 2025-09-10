import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Departamento from './departamento.js'

export default class Regionale extends BaseModel {
  @column({ isPrimary: true })
  declare idRegionales: number

  @column()
  declare regional: string

  @column()
  declare telefono: string

  @column()
  declare direccion: string

  @column()
  declare numero_centros: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Regionale, {
    foreignKey: 'idRegionales',
    })
    declare elecciones: HasMany<typeof Regionale>

  @column()
  declare departamentos_iddepartamento : number

  @belongsTo(() => Departamento, {
    foreignKey: 'departamentos_iddepartamento',
  })
  declare departamento: BelongsTo<typeof Departamento>

  @hasOne(() => Departamento)
  declare profile: HasOne<typeof Departamento>
}