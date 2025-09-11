import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', '#controllers/programas_formacion_controller.index')
    router.post('/', '#controllers/programas_formacion_controller.store')
    router.put('/:id', '#controllers/programas_formacion_controller.update')
  })
  .prefix('/programas')
