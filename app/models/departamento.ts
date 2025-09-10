import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Municipio from './municipio.js'
import type  { HasMany } from '@adonisjs/lucid/types/relations'

export default class Departamento extends BaseModel {
  @column({ isPrimary: true })
  declare iddepartamentos: number

  @column()
  declare departamentos: string

  @hasMany(() => Municipio, {
    foreignKey: 'iddepartamentos',
  })
  declare departamento: HasMany<typeof Municipio>
}
