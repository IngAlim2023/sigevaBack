import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Municipio from './municipio.js'
import Regionale from './regionale.js'

export default class Departamento extends BaseModel {
  @column({ isPrimary: true })
  declare iddepartamentos: number

  @column()
  declare departamentos: string

  @hasMany(() => Municipio, {
    foreignKey: 'iddepartamentos',
  })
  declare relac: HasMany<typeof Municipio>

  @hasOne(() => Regionale)
  declare profile: HasOne<typeof Regionale>
}
