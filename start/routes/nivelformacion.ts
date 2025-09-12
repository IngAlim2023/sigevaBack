import router from '@adonisjs/core/services/router'
import NivelFormacionController from '#controllers/niveles_formacion_controller';

const nivelFormacionController = new NivelFormacionController;

router
  .group(() => {
    router.post('/crear', nivelFormacionController.crear)

    router.get('/listar', nivelFormacionController.getAll)

    router.get('/listar/:id', nivelFormacionController.getById)

    router.put('/actualizar/:id', nivelFormacionController.actualizar)
  })
  .prefix('/api/nivel')
