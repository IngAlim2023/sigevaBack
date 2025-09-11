import ReportesController from "#controllers/reportes_controller";
import router from "@adonisjs/core/services/router";

const reportes = new ReportesController;

router.get('/reportes', reportes.filtrar)