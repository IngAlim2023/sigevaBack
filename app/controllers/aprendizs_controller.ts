// import type { HttpContext } from '@adonisjs/core/http'

import Aprendiz from '#models/aprendiz'
import { HttpContext } from '@adonisjs/core/http'
import Hash from '@adonisjs/core/services/hash'
export default class AprendizsController {
  async registro({ request, response }: HttpContext) {
    const data = request.only([
      'idgrupo',

      'idprograma_formacion',
      'perfil_idperfil',
      'nombres',
      'apellidos',
      'celular',
      'estado',
      'tipo_documento',
      'numero_documento',
      'email',
      'password',
    ])
    data.password = await Hash.make(data.password)
    const aprendiz = await Aprendiz.create(data)
    return response.created({
      mensage: 'Aprendiz creado con exito',
      data: aprendiz,
    })
  }
  async traer({ response }: HttpContext) {
    try {
      const aprendices = await Aprendiz.all()
      return response.ok(aprendices)
    } catch (error) {
      return response.status(500).send({
        message: 'Error al obtener aprendices',
        error: error.message,
      })
    }
  }
}
