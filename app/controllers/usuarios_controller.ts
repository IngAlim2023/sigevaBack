import { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import bcrypt from 'bcrypt'
import Perfil from '#models/perfil'

export default class UsuariosController {
  
  async crear({ request, response }: HttpContext) {
    try {
      const { email, password, estado, idperfil, idcentro_formacion } = request.body()

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

      const perfil = await Perfil.findBy('idperfil', usuario.idperfil)

      return response.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          id: usuario.idusuarios,
          email: usuario.email,
          estado: usuario.estado,
          perfil: perfil?.perfil,
          centroFormacion: usuario.idcentro_formacion,
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

  async actualizar({ request, response, params }: HttpContext) {
    try {
      const id = params.id
      const usuario = await Usuario.find(id)

      if (!usuario) {
        return response.status(404).json({ success: false, message: 'Usuario no encontrado' })
      }

      const { email, password, estado, idperfil, idcentro_formacion } = request.body()

      // Solo actualiza si se envía un nuevo valor
      if (email) usuario.email = email
      if (password) usuario.password = await bcrypt.hash(password, 10)
      if (estado !== undefined) usuario.estado = estado
      if (idperfil) usuario.idperfil = idperfil
      if (idcentro_formacion) usuario.idcentro_formacion = idcentro_formacion

      await usuario.save()

      return response.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: {
          id: usuario.idusuarios,
          email: usuario.email,
          estado: usuario.estado,
          perfil: usuario.idperfil,
          CentroFormacion: usuario.idcentro_formacion
        }
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error interno al actualizar usuario',
        error: error.message
      })
    }
  }
    async listarFuncionarios({ response }: HttpContext) {
    try {
      const funcionarios:any = await Usuario.query()
        .preload('perfil')
        .preload('centro')
        .whereHas('perfil', (query) => {
          query.where('perfil', 'Funcionario') 
        })

      return response.status(200).json({
        success: true,
        message: 'Funcionarios listados correctamente',
        data: funcionarios.map((f:any) => ({
          id: f.idusuarios,
          email: f.email,
          estado: f.estado,
          perfil: f.perfil?.perfil,
          centroFormacion: f.centro?.nombre, // ajusta según tu tabla centro_formacion
        })),
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error al listar funcionarios',
        error: error.message,
      })
    }
  }
}