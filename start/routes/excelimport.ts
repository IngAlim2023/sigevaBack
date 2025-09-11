/* eslint-disable @adonisjs/prefer-lazy-controller-import */
/* eslint-disable prettier/prettier */
import router from "@adonisjs/core/services/router";

import importcontroller from "#controllers/ImportController";


router.post('/aprendices/importar',[importcontroller,'importarAprendices'])