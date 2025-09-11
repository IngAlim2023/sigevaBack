/* eslint-disable prettier/prettier */
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import CentroFormacion from './centro_formacion.js'
import  type{ BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Candidatos from './candidatos.js'

export default class Eleccione extends BaseModel {
  @column({ isPrimary: true, columnName: 'ideleccion'  })
  declare idEleccion: number

  @column()
  declare fecha_inicio: Date

  @column()
  declare fecha_fin: Date

  @column()
  declare hora_inicio: DateTime

  @column()
  declare hora_fin: DateTime
  
  @column()
  declare idCentro_formacion: number

  @belongsTo(() => CentroFormacion, {
  foreignKey: 'idcentro_formacion',
  })
  declare centro: BelongsTo<typeof CentroFormacion>

  @hasMany(() => Candidatos, {
    foreignKey: 'idEleccion',
    })
    declare Eleccione: HasMany<typeof Candidatos>
}
