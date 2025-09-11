/* eslint-disable @adonisjs/prefer-lazy-controller-import */
/* eslint-disable prettier/prettier */
import ImportController from "#controllers/ImportController";
import router from "@adonisjs/core/services/router";

const importController = new ImportController();

router.post('/aprendices/importar',importController.importarAprendices)