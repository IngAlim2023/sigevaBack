import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Votoxcandidato extends BaseModel {
  @column({ isPrimary: true })
  declare idvotoxcandidato: number

  @column()
  declare idcandidatos: number

  @column()
  declare idAprendiz: number
  
  @column()
  declare contador: number
}