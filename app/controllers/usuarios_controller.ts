import { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import bcrypt from 'bcrypt'

export default class UsuariosController {
  async register({ request, response }: HttpContext) {
    try {
      const { email, password, estado, idperfil, idcentro_formacion  } = request.body()

      const existe = await Usuario.findBy('email', email)
      if (existe) {
        return response.status(400).json({ message: 'El email ya está registrado' })
      }

      const hashpassword = await bcrypt.hash(password, 10)

      const usuario = await Usuario.create({ email, password: hashpassword, estado, idperfil, idcentro_formacion })

      return response.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          email: usuario.email,
          estado: usuario.estado,
          perfil: usuario.idperfil,
          CentroFormacion: usuario.idcentro_formacion

        }
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error interno',
        error: error.message
      })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.body()

      const usuario = await Usuario.findBy('email', email)
      if (!usuario) {
        return response.status(401).json({ success: false, message: 'Usuario no encontrado' })
      }

      const passwordValido = await bcrypt.compare(password, usuario.password)
      if (!passwordValido) {
        return response.status(401).json({ success: false, message: 'Contraseña incorrecta' })
      }

      return response.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          id: usuario.idusuarios,
          email: usuario.email,
          estado: usuario.estado
    
        }
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error interno',
        error: error.message
      })
    }
  }
  
}
