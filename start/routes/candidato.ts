const CandidatosController = () => import('#controllers/candidatos_controller')
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/registro', [CandidatosController, 'store'])
  })
  .prefix('candidatos')
