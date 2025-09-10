import { BaseModel,  belongsTo,  column, hasMany} from '@adonisjs/lucid/orm'
import  type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Departamento from './departamento.js'
import CentroFormacion from './centro_formacion.js'

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
  declare centro: BelongsTo<typeof Departamento>

  @hasMany(() => CentroFormacion, {
  foreignKey: 'idcentro_formacion',
  })
  declare departamento: HasMany<typeof CentroFormacion>

  @hasMany(() => CentroFormacion, {
  foreignKey: 'idmunicipios',
  })
  declare municipio: HasMany<typeof CentroFormacion>
  
}
