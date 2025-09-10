import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type  { BelongsTo } from '@adonisjs/lucid/types/relations'
import Departamento from './departamento.js'

export default class Municipio extends BaseModel {
  @column({ isPrimary: true })
  declare idmunicipios: number

  @column()
  declare municipios: string

    @column()
    declare iddepartamentos: number
  
    @belongsTo(() => Departamento, {
      foreignKey: 'iddepartamentos',
    })
    declare municipio: BelongsTo<typeof Departamento>
}