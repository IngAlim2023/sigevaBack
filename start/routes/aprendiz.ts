import router from '@adonisjs/core/services/router'
router
  .group(() => {
    // Crear aprendiz
    router.post('/registro', 'AprendizsController.registro')

    // Traer todos los aprendices
    router.get('/', 'AprendizsController.traer')

    // Actualizar aprendiz por id
    router.put('/:id', 'AprendizsController.actualizar')

    // Login
    router.post('/login', 'AprendizsController.login')

    // Actualizar contraseña por correo
    router.put('/contrasena', 'AprendizsController.actualizarContrasena')
  })
  .prefix('/aprendiz') // Esto hace que todas las rutas tengan /aprendiz al inicio por si las moscas
