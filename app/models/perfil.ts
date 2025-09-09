import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Perfil extends BaseModel {
  @column({ isPrimary: true })
  declare idperfil: number

  @column()
  declare perfil: "admin" | "funcionario" | "aprendiz"
}
