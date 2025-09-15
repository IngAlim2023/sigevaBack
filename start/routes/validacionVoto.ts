import router from '@adonisjs/core/services/router'
import ValidacionVotoController from '#controllers/validacionVotoController'

const validacionVotoController = new ValidacionVotoController()

// Obtener todas las validaciones
router.get('/api/validaciones', validacionVotoController.index)

// Obtener validación específica por ID
router.get('/api/validaciones/:id', validacionVotoController.show)

// SISTEMA DE VOTACIÓN CON OTP
// Generar OTP para votar
router.post('/api/validaciones/generarOtp', validacionVotoController.generarOtp)
router.post('/api/validaciones/validarOtp', validacionVotoController.validarOtp)
