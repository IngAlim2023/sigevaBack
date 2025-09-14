import UsuariosController from '#controllers/usuarios_controller'
import router from '@adonisjs/core/services/router'

const user = new UsuariosController()

router.post('/api/usuarios/crear', user.crear)
router.post('/api/usuarios/login', user.login)
router.put('/api/usuarios/:id', user.actualizar)
