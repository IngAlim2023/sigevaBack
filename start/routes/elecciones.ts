/* eslint-disable @adonisjs/prefer-lazy-controller-import */
/* eslint-disable prettier/prettier */
import router from "@adonisjs/core/services/router"
import EleccionControler from "#controllers/eleccion_controller"

const eleccion = new EleccionControler;


router.get('/eleccion', eleccion.traerEleccion)
router.get('/eleccion/centro/:idCentro_formacion', eleccion.traerPorCentroFormacion])

router.post('/crear/eleccion', eleccion.crearEleccion)

router.put('/actualizar/eleccion/:idEleccion', eleccion.actualizarEleccion)