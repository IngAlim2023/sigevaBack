/* eslint-disable prettier/prettier */
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Eleccione extends BaseModel {
  @column({ isPrimary: true })
  declare ideleccion: number

  @column({columnName: 'idcentro_formacion'})
  declare idCentro_formacion: number

  @column({columnName: 'fecha_inicio'})
  declare fecha_inicio: Date

  @column({columnName: 'fecha_fin'})
  declare fecha_fin: Date

  @column({columnName: 'hora_inicio'})
  declare hora_inicio: DateTime

  @column({columnName: 'hora_fin'})
  declare hora_fin: DateTime

  @column()
  declare nombre: string

}