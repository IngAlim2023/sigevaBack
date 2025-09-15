import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'validacionvoto'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('otp_expira_en').nullable()
      table.integer('candidato_id').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('otp_expira_en')
      table.dropColumn('candidato_id')
    })
  }
}