import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type  { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import CentroFormacion from './centro_formacion.js'
import Perfil from './perfil.js'

export default class Usuario extends BaseModel {

  @column({ isPrimary: true })
  declare idusuarios: number

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare estado: "Activo" | "Inactivo"

  @column()
  declare idperfil: number

  @column()
  declare idcentro_formacion: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Perfil, {
    foreignKey: 'idperfil',
  })
  declare perfil: BelongsTo<typeof Perfil>

  @belongsTo(() => CentroFormacion, {
    foreignKey: 'idcentro_formacion',
  })
  declare centro: BelongsTo<typeof CentroFormacion>

}