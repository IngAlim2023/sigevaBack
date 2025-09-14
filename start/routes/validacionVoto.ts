import router from '@adonisjs/core/services/router'
import ValidacionVotoController from '#controllers/validacionVotoController'

const validacionVotoController = new ValidacionVotoController()

// Obtener todas las validaciones
router.get('/validaciones', validacionVotoController.index)

// Crear nueva validación
router.post('/validaciones', validacionVotoController.store)

// Obtener validación específica por ID
router.get('/validaciones/:id', validacionVotoController.show)