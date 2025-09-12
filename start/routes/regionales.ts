import RegionalController from "#controllers/regionalesController";
import router from "@adonisjs/core/services/router";

const regionalController = new RegionalController()

router.get('/regionales', regionalController.read)
router.put('/regionales/actualizar', regionalController.actualizar)


