import GruposController from '#controllers/grupo_controller'
import router from '@adonisjs/core/services/router'
import GrupoController from 'App/Controllers/Http/GrupoController'

router.post('/grupos/importar', GruposController.subirDesdeExcel)
