import router from '@adonisjs/core/services/router'
import GrupoController from '#controllers/grupo_controller'

const grupoController = new GrupoController();

router
  .group(() => {
    router.post('/', grupoController.crear)
    router.get('/', grupoController.getAll)
    router.get('/:id', grupoController.getById)
    router.put('/:id', grupoController.actualizar)
  })
  .prefix('/grupo')
