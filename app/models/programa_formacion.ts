import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import NivelFormacion from './nivel_formacion.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Aprendiz from './aprendiz.js'

export default class ProgramaFormacion extends BaseModel {
  public static table = 'programa_formacion'

  @column({ isPrimary: true })
  declare idprograma_formacion: number

  @column()
  declare idarea_tematica: number

  @column()
  declare programa: string

  @column()
  declare codigo_programa: number

  @column()
  declare version: string

  @column()
  declare duracion: number

  @column()
  declare idnivel_formacion: number
  
  @belongsTo(() => NivelFormacion, {
    foreignKey: 'idnivel_formacion',
  })
  
  declare formacion: BelongsTo<typeof NivelFormacion>

  
  @hasMany(() => Aprendiz, {
  foreignKey: 'idPrograma_formacion',
  })
      
  declare departamento: HasMany<typeof Aprendiz>

}
