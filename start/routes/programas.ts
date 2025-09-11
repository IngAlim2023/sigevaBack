import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/listar', '#controllers/programas_formacion_controller.index')
    router.post('/crear', '#controllers/programas_formacion_controller.store')
    router.put('/actualizar/:id', '#controllers/programas_formacion_controller.update')
  })
  .prefix('/programasFormacion')
