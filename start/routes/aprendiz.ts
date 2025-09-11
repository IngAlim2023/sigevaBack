import router from '@adonisjs/core/services/router'
import AprendizsController from '#controllers/aprendizs_controller'

const aprendizsController = new AprendizsController()


router
  .group(() => {
    // Crear aprendiz
    router.post('/registro', aprendizsController.registro)

    // Traer todos los aprendices
    router.get('/', aprendizsController.traer)

    // Actualizar aprendiz por id
    router.put('/actualizar/:id', aprendizsController.actualizar)

    // Login
    router.post('/login', aprendizsController.login)

    // Actualizar contraseña por correo
    router.put('/contrasena', aprendizsController.actualizarContrasena)
  })
  .prefix('/aprendiz') // Esto hace que todas las rutas tengan /aprendiz al inicio por si las moscas
