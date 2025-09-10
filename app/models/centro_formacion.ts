import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type  { HasMany } from '@adonisjs/lucid/types/relations'
import Usuario from './usuario.js'

export default class CentroFormacion extends BaseModel {
  @column({ isPrimary: true })
  declare idCentro_formacion: number

  @column()
  declare idregional?: number

  @column()
  declare centro_formacioncol: string

  @column()
  declare idmunicipios?: number

  @column()
  declare direccion: string

  @column()
  declare telefono: string

  @column()
  declare correo: string

  @column()
  declare subdirector: string

  @column()
  declare correosubdirector: string

  @hasMany(() => Usuario, {
    foreignKey: 'idCentro_formacion',
  })
  declare usuarios: HasMany<typeof Usuario>
}