// import UsuarioController from '../app/controller/UserController.js'

// eslint-disable-next-line @adonisjs/prefer-lazy-controller-import


import AprendizsController from '#controllers/aprendizs_controller'
import ImportExcelController from '#controllers/ImportController'
import router from '@adonisjs/core/services/router'
import './routes/elecciones.js'

// const usuarioController = new UsuarioController()

// router.post('/register', [UsuarioController, 'register'])
// router.post('/login', [UsuarioController, 'login'])
const aprendizcontroller = new AprendizsController()
const importcontroller = new ImportExcelController()
// router.post('/login/aprendiz', [AprendizsController, 'login'])

router.post('/login/aprendiz', [AprendizsController, 'login'])
router.post('/registro', [AprendizsController, 'registro'])


router.post('/aprendices/importar', [ImportExcelController, 'importarAprendices'])

import './routes/candidato.js'

