/* eslint-disable @adonisjs/prefer-lazy-controller-import */
/* eslint-disable prettier/prettier */
import router from "@adonisjs/core/services/router"
import EleccionControler from "#controllers/eleccion_controller"

const eleccion = new EleccionControler;


router.get('/api/eleccion', eleccion.traerEleccion)
router.get('/api/eleccion/activas', eleccion.traerEleccionesActivas)
router.get('/api/eleccionPorCentro/:idCentro_formacion', eleccion.traerPorCentroFormacion)

router.get('/api/eleccion/traerFiltro', eleccion.traerFiltrado) //Nueva para filtrar por jornada centro formacion candidatos

router.get('/api/eleccionJornada/listar', eleccion.traerPorJornada)

router.post('/api/eleccion/crear', eleccion.crearEleccion)

router.put('/api/eleccionActualizar/:idEleccion', eleccion.actualizarEleccion)