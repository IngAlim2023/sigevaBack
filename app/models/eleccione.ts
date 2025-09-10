/* eslint-disable prettier/prettier */
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import CentroFormacion from './centro_formacion.js'
import  type{ BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Candidatos from './candidatos.js'

export default class Eleccione extends BaseModel {
  @column({ isPrimary: true })
  declare ideleccion: number


  @column({columnName: 'idcentro_formacion'})
  declare idCentro_formacion: number

  @column({columnName: 'fecha_inicio'})

  @column()

  declare fecha_inicio: Date

  @column({columnName: 'fecha_fin'})
  declare fecha_fin: Date

  @column({columnName: 'hora_inicio'})
  declare hora_inicio: DateTime

  @column({columnName: 'hora_fin'})
  declare hora_fin: DateTime

  @column()
  declare nombre: string

  @belongsTo(() => CentroFormacion, {
  foreignKey: 'idcentro_formacion',
  })
  declare centro: BelongsTo<typeof CentroFormacion>

  @hasMany(() => Candidatos, {
    foreignKey: 'ideleccion',
    })
    declare candidato: HasMany<typeof Candidatos>
  
  }

