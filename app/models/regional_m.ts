import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RegionalM extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string
  @column()
  declare regional: string
  @column()
  declare direccion: string

  @column()
  declare telefono: string
  @column()
  declare numerocentros: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
