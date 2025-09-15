import Aprendiz  from './aprendiz.js';
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Eleccione from './eleccione.js';
export default class ValidacionVoto extends BaseModel {
  static table = 'validacionvoto'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare aprendiz_idaprendiz: number 

  @column()
  declare elecciones_ideleccion: number 

  @column.dateTime()
  declare otp_expira_en: DateTime | null

  @column()
  declare candidato_id: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //relaciones

  @belongsTo(() => Aprendiz, {
    foreignKey: 'aprendiz_idaprendiz'
  })
  declare aprendiz: any

  @belongsTo(() => Eleccione, {
    foreignKey: 'elecciones_ideleccion'
  })
  declare eleccion: any
}