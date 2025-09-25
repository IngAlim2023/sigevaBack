import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Candidatos from './candidatos.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Aprendiz from './aprendiz.js'

export default class Votoxcandidato extends BaseModel {
  public static table = 'votoxcandidato'
  @column({ isPrimary: true })
  declare idvotoxcandidato: number

  @column()
  declare idaprendiz: number
  
  @column()
  declare contador: number

  @column()
  declare idcandidatos: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
    
  @belongsTo(() => Candidatos, {
  foreignKey: 'idcandidatos',
})
  declare candidato: BelongsTo<typeof Candidatos>

    
  @belongsTo(() => Aprendiz, {
  foreignKey: 'idaprendiz',
})
  declare aprendiz: BelongsTo<typeof Aprendiz>


}