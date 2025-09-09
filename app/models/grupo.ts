import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
