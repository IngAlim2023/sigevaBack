import VotoxcandidatoController from "#controllers/votoxcandidato_controller";
import router from "@adonisjs/core/services/router";

router
    .group(() => {
        router.post('/crear', [VotoxcandidatoController, 'crear'])
        router.get('/traer', [VotoxcandidatoController, 'getAll'])
        router.get('/years', [VotoxcandidatoController, 'getYears'])
    }).prefix('/votoxcandidato')