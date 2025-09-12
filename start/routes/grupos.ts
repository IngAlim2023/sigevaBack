import router from '@adonisjs/core/services/router'
import GrupoController from '#controllers/grupo_controller'

const grupoController = new GrupoController();

router
  .group(() => {
    router.post('/crear', grupoController.crear)
    router.get('/listar', grupoController.getAll)
    router.get('/listar/:id', grupoController.getById)
    router.put('/listar/:id', grupoController.actualizar)
  })
  .prefix('/api/grupo')
