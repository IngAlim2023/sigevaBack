import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'validacionvoto'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Primero eliminar la columna id existente
      table.dropColumn('id')
    })
    
    this.schema.alterTable(this.tableName, (table) => {
      // Agregar la nueva columna id con auto-increment al inicio
      table.increments('id').primary().first()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('id')
    })
    
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id').primary()
    })
  }
}