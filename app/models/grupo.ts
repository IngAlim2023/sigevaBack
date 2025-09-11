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

  @hasMany(() => Aprendiz, {
    foreignKey: 'idgrupo',
  })
  declare aprendices: HasMany<typeof Aprendiz>
}
