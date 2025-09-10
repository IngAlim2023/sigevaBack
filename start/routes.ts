// import UsuarioController from '../app/controller/UserController.js'

// eslint-disable-next-line @adonisjs/prefer-lazy-controller-import
/* import AprendizsController from '#controllers/aprendizs_controller' */
import router from '@adonisjs/core/services/router'
/* import MunicipiosController from '#controllers/municipios_controller' */
import CentroFormacionController from '#controllers/centro_formacion_controller'


// const usuarioController = new UsuarioController()

// router.post('/register', [UsuarioController, 'register'])
// router.post('/login', [UsuarioController, 'login'])
/* 
const aprendizcontroller = new AprendizsController()
router.post('/aprendiz', [AprendizsController, 'registro'])
router.get('/aprendiz', [AprendizsController, 'traer'])

router.post('/login/aprendiz', [AprendizsController, 'login']) */

/* 
router.post('/login/aprendiz', [AprendizsController, 'login']) */

/* router.get('/municipios', [MunicipiosController, 'index']) */

router.get('/centros', [CentroFormacionController, 'index'])      
router.post('/centros', [CentroFormacionController, 'store'])      
router.put('/centros/:id', [CentroFormacionController, 'update']) 
