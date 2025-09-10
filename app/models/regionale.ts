import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Departamento from './departamento.js'

export default class Regionale extends BaseModel {
  public static table='regional'
  @column({ isPrimary: true })
  declare idregional: number

  @column({columnName:'departamentos_iddepartamentos'})
  declare departamentos_iddepartamentos: string

  @column()
  declare regional: string

  @column()
  declare telefono: string

  @column()
  declare direccion: string

  @column({columnName:'numero_centros'})
  declare numero_centros: number

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