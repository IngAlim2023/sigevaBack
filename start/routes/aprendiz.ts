import router from '@adonisjs/core/services/router'
import AprendizsController from '#controllers/aprendizs_controller'

const aprendizsController = new AprendizsController()

router
  .group(() => {
    // Crear aprendiz
    router.post('/crear', aprendizsController.registro)

    // Traer todos los aprendices
    router.get('/listar', aprendizsController.traer)
    // start/routes.ts
    router.get('/centros/:idCentro/', aprendizsController.aprendicesPorCentro)

    // Actualizar aprendiz por id
    router.put('/actualizar/:id', aprendizsController.actualizar)

    // Login
    router.post('/login', aprendizsController.login)

    // Actualizar contraseña por correo

    router.put('/actualizar/contrasena', aprendizsController.actualizarContrasena)

    // Disponibles totales y por centros

    router.get('/disponibles/', aprendizsController.aprendicesAvaibleAll)

    router.get('/disponibles/centros/:id', aprendizsController.aprendicesAvailableByCentros)
  
    //Aprendices inscritos por cecntro de información:
    router.get('/inscritos/centro/:id', aprendizsController.aprendicesInscritosByCentro)


  })
  .prefix('/api/aprendiz') // Esto hace que todas las rutas tengan /aprendiz al inicio por si las moscas
