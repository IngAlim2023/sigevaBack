import CentroFormacionController from "#controllers/centro_formacion_controller";
import router from "@adonisjs/core/services/router";

const centroFormacion = new CentroFormacionController;

router.post('/api/centrosFormacion/crear',centroFormacion.crear) 
router.get('/api/centrosFormacion/obtiene', centroFormacion.obtiene) 
router.get('/api/centrosFormacion/obtiene/porRegional/:regional', centroFormacion.obtenerPorRegional) 
router.put('/api/centrosFormacion/:id',centroFormacion.actualiza)
