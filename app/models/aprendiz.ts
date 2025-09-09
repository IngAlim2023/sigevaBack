import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import ProgramaFormacion from './programa_formacion.js'
import Perfil from './perfil.js'
import Grupo from './grupo.js'

export default class Aprendiz extends BaseModel {
  public static table = 'aprendiz'
  @column({ isPrimary: true })
  declare idaprendiz: number

  @column()
  declare idgrupo: number

  @column()
  declare idprograma_formacion: number

  @column()
  declare perfil_idperfil: number

  @column()
  declare nombres: string

  @column()
  declare apellidos: string

  @column()
  declare celular: string

  @column()
  declare estado: string

  @column()
  declare tipo_documento: string

  @column()
  declare numero_documento: string

  @column()
  declare email: string

  @column()
  declare password: string

  // Relaciones
  @belongsTo(() => Grupo, {
    foreignKey: 'idgrupo',
  })
  declare grupo: any

  @belongsTo(() => ProgramaFormacion, {
    foreignKey: 'idPrograma_formacion',
  })
  declare programa: any

  @belongsTo(() => Perfil, {
    foreignKey: 'perfil_idperfil',
  })
  declare perfil: any
}
