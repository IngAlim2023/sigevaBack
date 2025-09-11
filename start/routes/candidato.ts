const CandidatosController = () => import('#controllers/candidatos_controller')
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/registro', [CandidatosController, 'store'])
    router.get('/eleccion/:ideleccion', [CandidatosController, 'getByEleccion'])
    router.put('/actualizar/:id', [CandidatosController, 'update'])
    router.delete('/eliminar/:id', [CandidatosController, 'delete'])
    router.get('/obtener', [CandidatosController, 'show'])
  })
  .prefix('candidatos')
