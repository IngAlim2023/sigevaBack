/* eslint-disable @adonisjs/prefer-lazy-controller-import */
/* eslint-disable prettier/prettier */
import router from "@adonisjs/core/services/router";

import EleccionControler from "#controllers/eleccion_controller";


router.get('/eleccion', [EleccionControler, 'traerEleccion'])
router.get('/eleccion/centro/:idCentro_formacion', [EleccionControler, 'traerPorCentroFormacion'])

router.post('/crear/eleccion', [EleccionControler, 'crearEleccion'])

router.put('/actualizar/eleccion/:idEleccion', [EleccionControler, 'actualizarEleccion'])