import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Municipio from './municipio.js'
import type  { HasMany } from '@adonisjs/lucid/types/relations'

export default class Departamento extends BaseModel {
  @column({ isPrimary: true })
  declare iddepartamentos: number
  @column()
  declare departamentos: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Municipio, {
    foreignKey: 'iddepartamentos',
  })
  declare usuarios: HasMany<typeof Municipio>
}
