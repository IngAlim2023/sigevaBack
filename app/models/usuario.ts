import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CentroFormacion from './centro_formacion.js'
import Perfil from './perfil.js'
import { DateTime } from 'luxon'

export default class Usuario extends BaseModel {
  public static table = 'usuarios'
  public static timestamps = false

  @column({ isPrimary: true, columnName: 'idusuarios' })
  declare idusuarios: number

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare estado: 'Activo' | 'Inactivo'

  @column({ columnName: 'idperfil' })
  declare idperfil: number

  @column({ columnName: 'idcentro_formacion' })
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
