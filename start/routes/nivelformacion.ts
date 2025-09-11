import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/', 'NivelFormacionController.crear')

    router.get('/', 'NivelFormacionController.getAll')

    router.get('/:id', 'NivelFormacionController.getById')

    router.put('/:id', 'NivelFormacionController.actualizar')
  })
  .prefix('/nivel')
