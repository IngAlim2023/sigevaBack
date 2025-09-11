import router from '@adonisjs/core/services/router'
import AprendizsController from '#controllers/aprendizs_controller'

const aprendizsController = new AprendizsController()

router
  .group(() => {
    // Crear aprendiz
    router.post('/crear', aprendizsController.registro)

    // Traer todos los aprendices
    router.get('/listar', aprendizsController.traer)

    // Actualizar aprendiz por id
    router.put('/actualizar/:id', aprendizsController.actualizar)

    // Login
    router.post('/login', aprendizsController.login)

    // Actualizar contraseña por correo

    router.put('/actualizar/contrasena', aprendizsController.actualizarContrasena)
  })
  .prefix('/api/aprendiz') // Esto hace que todas las rutas tengan /aprendiz al inicio por si las moscas
