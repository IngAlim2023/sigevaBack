import RegionalController from "#controllers/RegionalController";

import router from "@adonisjs/core/services/router";

const resG = new RegionalController()

router.get('/regionales', resG.readAll)