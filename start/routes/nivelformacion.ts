import router from '@adonisjs/core/services/router'
import NivelFormacionController from '#controllers/niveles_formacion_controller';

const nivelFormacionController = new NivelFormacionController;

router
  .group(() => {
    router.post('/', nivelFormacionController.crear)

    router.get('/', nivelFormacionController.getAll)

    router.get('/:id', nivelFormacionController.getById)

    router.put('/:id', nivelFormacionController.actualizar)
  })
  .prefix('/nivel')
