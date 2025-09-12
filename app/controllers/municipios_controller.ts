import Municipio from '#models/municipio'
import type { HttpContext } from '@adonisjs/core/http'

export default class MunicipiosController {

    async conuslta({response}: HttpContext){
        try{
            const municipios = await Municipio.query().preload('municipio')

            return response.status(200).json({

                success:true,
                data: municipios,
            })
        } catch(error){
            return response.status(500).json({
                success: false,
                message: "Error al obtener los municipios",
                error: error.message
            })
        }
    }

}