import GeneracionReporteController from '#controllers/generacion_reporte_controller'
import router from '@adonisjs/core/services/router'

const generacion = new GeneracionReporteController()

// Reporte por elección
router.get('/api/reporte/eleccion/:id', generacion.reporteEleccion)
