import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/', 'GrupoController.crear')
    router.get('/', 'GrupoController.getAll')
    router.get('/:id', 'GrupoController.getById')
    router.put('/:id', 'GrupoController.actualizar')
    router.delete('/:id', 'GrupoController.eliminar')
  })
  .prefix('/grupo')
