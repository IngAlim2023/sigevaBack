import VotoxcandidatoController from "#controllers/votoxcandidato_controller";
import router from "@adonisjs/core/services/router";
import ValidarVotoAnual from "#middleware/validarVotoAnual";

const middleware=new ValidarVotoAnual()
router
    .group(() => {
        
        router.get('/traer', [VotoxcandidatoController, 'getAll'])
        router.get('/cantidad/:id', [VotoxcandidatoController, 'quantityVotes'])
    }).prefix('/votoxcandidato')


    router.post('/votoxcandidato/crear', [VotoxcandidatoController, 'crear']).use(middleware.handle)