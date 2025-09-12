import RegionalController from "#controllers/regionalesController";
import router from "@adonisjs/core/services/router";

const regionalController = new RegionalController()

router.get('/api/regionales', regionalController.read)
router.put('/api/regionales/actualizar', regionalController.actualizar)


