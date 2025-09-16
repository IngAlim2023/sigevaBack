/* eslint-disable @adonisjs/prefer-lazy-controller-import */
/* eslint-disable prettier/prettier */
import router from "@adonisjs/core/services/router"
import EleccionControler from "#controllers/eleccion_controller"

const eleccion = new EleccionControler;


router.get('/api/eleccion', eleccion.traerEleccion)
router.get('/api/eleccionPorCentro/:idCentro_formacion', eleccion.traerPorCentroFormacion)
router.get('/api/eleccion/activas', eleccion.traerEleccionesActivas)

router.get('/api/eleccion/traerFiltro', eleccion.traerFiltrado)

router.get('/api/eleccionJornada/listar', eleccion.traerPorJornada)//para filtrar por grupos

router.post('/api/eleccion/crear', eleccion.crearEleccion)

router.put('/api/eleccionActualizar/:idEleccion', eleccion.actualizarEleccion)

router.get('/api/eleccion/centrof/:idcentro_formacion', eleccion.listarEleccionesPorCentroF)