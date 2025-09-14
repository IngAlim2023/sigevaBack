import Aprendiz  from './aprendiz.js';
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Eleccione from './eleccione.js';
export default class ValidacionVoto extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare codigo: string

  @column()
  declare aprendiz_idAprendiz: number 

  @column()
  declare elecciones_idEleccion: number 

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //relaciones

  @belongsTo(() => Aprendiz, {
    foreignKey: 'aprendiz_idAprendiz'
  })
  declare aprendiz: any

  @belongsTo(() => Eleccione, {
    foreignKey: 'elecciones_idEleccion'
  })
  declare eleccion: any
}