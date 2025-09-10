// import type { HttpContext } from '@adonisjs/core/http'

import Aprendiz from '#models/aprendiz'
import { HttpContext } from '@adonisjs/core/http'
//contraseña
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
  async actualizar({ request, response, params }: HttpContext) {
    try {
      const id = params.id
      const aprendiz = await Aprendiz.find(id)

      if (!aprendiz) {
        return response.status(404).json({ message: 'Aprendiz no encontrado' })
      }

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

      // Verificar email si se cambió
      if (data.email && data.email !== aprendiz.email) {
        const emailExist = await Aprendiz.findBy('email', data.email)
        if (emailExist) {
          return response.status(400).json({
            message: 'El correo ya está registrado, por favor usa otro',
          })
        }
      }

      // Hash de contraseña solo si se proporciona
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
      }

      aprendiz.merge(data)
      await aprendiz.save()

      return response.ok({
        message: 'Aprendiz actualizado con éxito',
        data: aprendiz,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error al actualizar aprendiz',
        error: error.message,
      })
    }
  }

  async actualizarContrasena({ request, response, params }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      if (!password || !email) {
        return response.status(400).json({ message: 'Debes enviar la nueva contraseña' })
      }

      const aprendiz = await Aprendiz.findBy('email', email)

      if (!aprendiz) {
        return response.status(404).json({ message: 'Aprendiz no encontrado' })
      }

      // Hashear la nueva contraseña
      aprendiz.password = await bcrypt.hash(password, 10)
      await aprendiz.save()

      return response.ok({ message: 'Contraseña actualizada con éxito' })
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Error al actualizar la contraseña', error: error.message })
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
