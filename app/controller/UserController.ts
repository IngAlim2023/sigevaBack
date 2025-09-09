    import { HttpContext } from '@adonisjs/core/http'
    import bcrypt from 'bcrypt'
    import User from '#models/user'


    export default  class UsuarioController{

    async register({ request, response }: HttpContext) {
    const { email, password, rol, estado } = request.all()

    // Verificar si ya existe
    const usuarioExiste = await User.findBy('email', email)
    if (usuarioExiste) {
      return response.badRequest({ mensaje: 'El correo ya existe' })

      }  // Encriptar contraseña
    const nuevacontrasena = await bcrypt.hash(password, 10)

    // Crear usuario
    const usuario = await User.create({
      email,
      password: nuevacontrasena,
      rol,
      estado
    })
    await usuario.save()
    return response.json({mensaje: 'Usuario Registrado', data:usuario})
}

async login({ request, response }: HttpContext) {

    const { email, password } = request.body()


    const usuario = await User.findBy('email', email)
    if (!usuario) {
      return response.notFound({ mensaje: 'El usuario no existe' })
    }

    const valido = await bcrypt.compare(password, usuario.password)
    if (!valido) {
      return response.unauthorized({ mensaje: 'Credenciales inválidas' })
    }else{
        return response.json({mensaje: true, usuario})
    }
   }
}
