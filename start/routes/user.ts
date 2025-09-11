import UsuariosController from "#controllers/usuarios_controller";
import router from "@adonisjs/core/services/router";

const user = new UsuariosController;

router.post('/register', user.register)
router.post('/login', user.login)