import CentroFormacionController from "#controllers/centro_formacion_controller";
import router from "@adonisjs/core/services/router";

const centroFormacion = new CentroFormacionController;

router.get('/centros-formacion', centroFormacion.index)
router.post('/centros-formacion',centroFormacion.store)
router.put('/centros-formacion/:id',centroFormacion.update)
