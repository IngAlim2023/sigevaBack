const CandidatosController = () => import('#controllers/candidatos_controller')
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/crear', [CandidatosController, 'store'])
    router.get('/listar/:ideleccion', [CandidatosController, 'getByEleccion'])
    router.put('/actualizar/:id', [CandidatosController, 'update'])
    router.delete('/eliminar/:id', [CandidatosController, 'delete'])
    router.get('/listar', [CandidatosController, 'show'])
  })
  .prefix('api/candidatogit s')
