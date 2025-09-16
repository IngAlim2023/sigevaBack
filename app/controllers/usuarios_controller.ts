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

  async crearFuncionario({ request, response }: HttpContext) {
    try {
      const { email, password, idcentro_formacion } = request.only([
        'email',
        'password',
        'idcentro_formacion'
      ])

      // Validar campos requeridos
      if (!email || !password || !idcentro_formacion) {
        return response.status(400).json({
          error: 'Faltan campos requeridos',
          required: ['email', 'password', 'idcentro_formacion']
        })
      }

      // Verificar si el perfil de Funcionario existe
      const perfilFuncionario = await Perfil.findBy('perfil', 'Funcionario')
      if (!perfilFuncionario) {
        return response.status(400).json({ 
          error: 'Perfil de Funcionario no configurado en el sistema' 
        })
      }

      // Verificar si el email ya existe
      const existe = await Usuario.findBy('email', email)
      if (existe) {
        return response.status(400).json({ 
          error: 'El correo electrónico ya está registrado' 
        })
      }

      // Crear el funcionario usando el modelo directamente
      const funcionario = await Usuario.create({
        email,
        password: await bcrypt.hash(password, 10),
        estado: 'Activo',
        idperfil: perfilFuncionario.idperfil,
        idcentro_formacion
      })

      // Obtener el funcionario recién creado sin cargar relaciones
      const funcionarioCreado = await Usuario.findOrFail(funcionario.idusuarios)

      return response.status(201).json({
        success: true,
        message: 'Funcionario creado exitosamente',
        data: {
          id: funcionarioCreado.idusuarios,
          email: funcionarioCreado.email,
          estado: funcionarioCreado.estado,
          idcentro_formacion: funcionarioCreado.idcentro_formacion,
          perfil: 'Funcionario'
        }
      })
    } catch (error) {
      console.error('Error en crearFuncionario:', error)
      return response.status(500).json({ 
        error: 'Error al crear funcionario',
        details: error.message 
      })
    }
  }

  async actualizarFuncionario({ request, response, params }: HttpContext) {
    try {
      const funcionario = await Usuario.findOrFail(params.id)
      const perfil = await Perfil.findOrFail(funcionario.idperfil)
      
      if (perfil.perfil !== 'Funcionario') {
        return response.status(400).json({ 
          success: false,
          message: 'El usuario no es un funcionario' 
        })
      }

      const { email, estado, idcentro_formacion } = request.only(['email', 'estado', 'idcentro_formacion'])
      
      // Actualizar solo los campos proporcionados
      if (email) funcionario.email = email
      if (estado) funcionario.estado = estado
      if (idcentro_formacion) funcionario.idcentro_formacion = idcentro_formacion
      
      await funcionario.save()
      
      return response.status(200).json({
        success: true,
        message: 'Funcionario actualizado exitosamente',
        data: {
          id: funcionario.idusuarios,
          email: funcionario.email,
          estado: funcionario.estado,
          idcentro_formacion: funcionario.idcentro_formacion,
          perfil: 'Funcionario'
        }
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({ 
          success: false,
          message: 'Funcionario no encontrado' 
        })
      }
      console.error('Error en actualizarFuncionario:', error)
      return response.status(500).json({ 
        success: false,
        message: 'Error al actualizar el funcionario',
        error: error.message 
      })
    }
  }

  async listarFuncionarios({ response }: HttpContext) {
    try {
      const funcionarios = await Usuario.query()
        .preload('perfil')
        .whereHas('perfil', (query) => {
          query.where('perfil', 'Funcionario')
        }).preload("centro", (c) => {
          c.preload("regional")
        })

      return response.json(funcionarios.map(f => ({
        id: f.idusuarios,
        email: f.email,
        estado: f.estado,
        centroFormacion: f.centro
      })))
    } catch (error) {
      return response.status(500).json({ error: 'Error al listar funcionarios' })
    }
  }
}