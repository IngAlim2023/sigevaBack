import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Aprendiz from './aprendiz.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Grupo extends BaseModel {
  @column({ isPrimary: true })
  declare idgrupo: number

  @column()
  declare grupo: string

  @column()
  declare jornada: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Aprendiz, {
    foreignKey: 'idgrupo',
  })
  declare departamento: HasMany<typeof Aprendiz>
}
