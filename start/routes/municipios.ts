import MunicipiosController from "#controllers/municipios_controller";
import router from "@adonisjs/core/services/router";

const municipio = new MunicipiosController;

router.get('/api/municipios', municipio.conuslta)
