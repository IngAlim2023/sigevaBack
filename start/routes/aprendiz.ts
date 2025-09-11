import router from '@adonisjs/core/services/router'
import AprendizsController from '#controllers/aprendizs_controller'
import ImportController from '#controllers/ImportController'

const aprendizsController = new AprendizsController()
const importController = new ImportController()

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

    router.post('/aprendices/importar', importController.importarAprendices)
  })
  .prefix('/aprendiz') // Esto hace que todas las rutas tengan /aprendiz al inicio por si las moscas
