import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Regionale extends BaseModel {
  public static table='regional'
  @column({ isPrimary: true })
  declare idregional: number

  @column({columnName:'departamentos_iddepartamentos'})
  declare departamentos_iddepartamentos: string

  @column()
  declare regional: string

  @column()
  declare telefono: string
  
  @column()
  declare direccion: string

  @column({columnName:'numero_centros'})
  declare numero_centros: number

}