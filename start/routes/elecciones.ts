/* eslint-disable @adonisjs/prefer-lazy-controller-import */
/* eslint-disable prettier/prettier */
import router from "@adonisjs/core/services/router"
import EleccionControler from "#controllers/eleccion_controller"

const eleccion = new EleccionControler;


router.get('/api/eleccion', eleccion.traerEleccion)
router.get('/api/eleccionPorCentro/:idCentro_formacion', eleccion.traerPorCentroFormacion)

router.get('/api/eleccionJornada/listar', eleccion.traerPorJornada)//Nueva para filtrar por gurpos

router.post('/api/eleccion/crear', eleccion.crearEleccion)

router.put('/api/eleccionActualizar/:idEleccion', eleccion.actualizarEleccion)