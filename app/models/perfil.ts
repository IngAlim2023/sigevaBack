import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Usuario from './usuario.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Aprendiz from './aprendiz.js'

export default class Perfil extends BaseModel {
  public static table = 'perfil'
  @column({ isPrimary: true })
  declare idperfil: number

  @column()
  declare perfil: string

  @hasMany(() => Usuario, {
    foreignKey: 'idperfil',
  })
  declare departamento: HasMany<typeof Usuario>

  @hasMany(() => Aprendiz, {
    foreignKey: 'perfil_idperfil',
  })
  declare aprendiz: HasMany<typeof Aprendiz>
}
