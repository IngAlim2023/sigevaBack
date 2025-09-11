import MunicipiosController from "#controllers/municipios_controller";
import router from "@adonisjs/core/services/router";

const municipio = new MunicipiosController;

router.get('/municipios', municipio.index)
