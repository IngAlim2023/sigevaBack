// import UsuarioController from '../app/controller/UserController.js'

// eslint-disable-next-line @adonisjs/prefer-lazy-controller-import
import AprendizsController from '#controllers/aprendizs_controller'
import router from '@adonisjs/core/services/router'

// const usuarioController = new UsuarioController()

// router.post('/register', [UsuarioController, 'register'])
// router.post('/login', [UsuarioController, 'login'])

const aprendizcontroller = new AprendizsController()
router.post('/aprendiz', [AprendizsController, 'registro'])
router.get('/aprendiz', [AprendizsController, 'traer'])
