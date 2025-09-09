import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type  { BelongsTo } from '@adonisjs/lucid/types/relations'
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

  @belongsTo(() => Perfil, {
    foreignKey: 'idperfil',
  })

   declare perfil: BelongsTo<typeof Perfil>
  
  @column()
  declare idcentro_formacion: number

  @belongsTo(() => CentroFormacion, {
    foreignKey: 'idcentro_formacion',
  })
  declare centro: BelongsTo<typeof CentroFormacion>

}