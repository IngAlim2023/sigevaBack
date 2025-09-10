import router from '@adonisjs/core/services/router'

const ProgramasFormacionController = () => import('#controllers/programas_formacion_controller')

router
  .group(() => {
    router.get('/', [ProgramasFormacionController, 'index'])
    router.post('/', [ProgramasFormacionController, 'store'])
    router.put('/:id', [ProgramasFormacionController, 'update'])
  })
  .prefix('/programas')
