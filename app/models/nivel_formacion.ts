import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class NivelFormacion extends BaseModel {
  @column({ isPrimary: true })
  declare idnivel_formacion: number
  @column()
  declare nivel_formacion: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
