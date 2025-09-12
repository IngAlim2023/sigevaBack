import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import ProgramaFormacion from './programa_formacion.js'
import Perfil from './perfil.js'
import Grupo from './grupo.js'
import Candidatos from './candidatos.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Votoxcandidato from './votoxcandidato.js'
import CentroFormacion from './centro_formacion.js'

export default class Aprendiz extends BaseModel {
  public static table = 'aprendiz'
  @column({ isPrimary: true })
  declare idaprendiz: number

  @column()
  declare idgrupo: number

  @column()
  declare perfil_idperfil: number
  @column()
  declare idprograma_formacion: number

  @column()
  declare nombres: string

  @column()
  declare apellidos: string

  @column()
  declare celular: string

  @column()
  declare estado: string
  @column()
  declare centro_formacion_idcentro_formacion: number

  @column()
  declare tipo_documento: string

  @column()
  declare numero_documento: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  // Relaciones
  @belongsTo(() => Grupo, {
    foreignKey: 'idgrupo',
    localKey: 'idgrupo',
  })
  declare grupo: any

  @belongsTo(() => ProgramaFormacion, {
    foreignKey: 'idprograma_formacion',
    localKey: 'idprograma_formacion',
  })
  declare programa: any

  @belongsTo(() => Perfil, {
    foreignKey: 'perfil_idperfil',
    localKey: 'idperfil',
  })
  declare perfil: any

  @hasMany(() => Candidatos, {
    foreignKey: 'idaprendiz',
    localKey: 'idaprendiz',
  })
  declare candidatos: HasMany<typeof Candidatos>

  @hasMany(() => Votoxcandidato, {
    foreignKey: 'idaprendiz',
    localKey: 'idaprendiz',
  })
  declare voto: HasMany<typeof Votoxcandidato>

  @belongsTo(() => CentroFormacion, {
    foreignKey: 'centro_formacion_idcentro_formacion',
    localKey: 'idcentro_formacion',
  })
  declare centro_formacion: any
}
