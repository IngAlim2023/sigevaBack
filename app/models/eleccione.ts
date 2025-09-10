/* eslint-disable prettier/prettier */
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Eleccione extends BaseModel {
  @column({ isPrimary: true })
  declare idEleccion: number

  @column()
  declare idCentro_formacion: number

  @column()
  declare fecha_inicio: Date

  @column()
  declare fecha_fin: Date

  @column()
  declare hora_inicio: DateTime

  @column()
  declare hora_fin: DateTime

}