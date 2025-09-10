
import { BaseModel, column } from '@adonisjs/lucid/orm'


export default class Votoxcandidato extends BaseModel {
  public static table = 'votoxcandidato'
  @column({ isPrimary: true })
  declare idvotoxcandidato: number

  @column()
  declare idcandidatos: number

  @column()
  declare idaprendiz: number

  @column()
  declare contador: number

  
}