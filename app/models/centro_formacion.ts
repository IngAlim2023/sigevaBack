import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type  { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Regionale from './regionale.js'
import Municipio from './municipio.js'
import Eleccione from './eleccione.js'
import Usuario from './usuario.js'

export default class CentroFormacion extends BaseModel {
  public static table = 'centro_formacion'
  
  @column({ isPrimary: true })
  declare idcentro_formacion: number

  @column()
  declare centro_formacioncol: string

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

  @column({ columnName: 'idregional' })
  declare idregional: number

  @belongsTo(() => Regionale,{
    foreignKey: 'idregional'
  })
  declare regional: BelongsTo<typeof Regionale>

  @column()
  declare idmunicipios:number

  @belongsTo(() => Municipio, {
    foreignKey: 'idmunicipios'
  })
  declare municipio: BelongsTo<typeof Municipio>

  @hasMany(() => Eleccione, {
  foreignKey: 'idcentro_formacion',
  })
  
  declare elecciones: HasMany<typeof Eleccione>

  @hasMany(() => Usuario, {
  foreignKey: 'idcentro_formacion',
  })

  declare usuario: HasMany<typeof Usuario>
  }

