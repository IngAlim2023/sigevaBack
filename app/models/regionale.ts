import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Regionale extends BaseModel {
  @column({ isPrimary: true })
  declare idRegionales: number

  @column()
  declare idDepartamento: string

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


}