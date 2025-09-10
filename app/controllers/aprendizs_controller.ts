// import type { HttpContext } from '@adonisjs/core/http'

import Aprendiz from '#models/aprendiz'
import { HttpContext } from '@adonisjs/core/http'

import bcrypt from 'bcrypt'
export default class AprendizsController {
  async registro({ request, response }: HttpContext) {
    try {
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
      const emailExist = await Aprendiz.findBy('email', data.email)
      if (emailExist) {
        return response.status(400).json({
          message: 'El correo ya está registrado, por favor usa otro',
        })
      }
      // Hashear la contraseña con bcrypt
      data.password = await bcrypt.hash(data.password, 10)
      const aprendiz = await Aprendiz.create(data)
      return response.created({
        message: 'Aprendiz creado con exito',
        data: aprendiz,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error al registrar aprendiz',
        error: error.message,
      })
    }
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
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const aprendizExist = await Aprendiz.findBy('email', email)

      if (!aprendizExist) return response.status(401).json({ message: 'Fallo en la autenticación' })

      const verifyPassword = await bcrypt.compare(password, aprendizExist.password)

      if (!verifyPassword)
        return response.status(401).json({ message: 'Fallo en la autenticación' })

      return response.status(200).json({ message: 'Autenticado' })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }
}
