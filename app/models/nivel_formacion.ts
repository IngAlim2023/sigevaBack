import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import ProgramaFormacion from './programa_formacion.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class NivelFormacion extends BaseModel {
  public static table = 'nivel_formacion'
  @column({ isPrimary: true })
  declare idnivel_formacion: number

  @column()
  declare nivel_formacion: string

<<<<<<< HEAD

=======
>>>>>>> 5ad4520957b5a12ad0800e24b4681fcdd8aefaad
  @hasMany(() => ProgramaFormacion, {
    foreignKey: 'idnivel_formacion',
  })
  declare formacion: HasMany<typeof ProgramaFormacion>
}
