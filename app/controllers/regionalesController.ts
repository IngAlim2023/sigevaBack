import RegionalServices from "#services/RegionalServices";
import { HttpContext } from "@adonisjs/core/http";

const regionalServices = new RegionalServices();

export default class RegionalController{
    async read ({response}: HttpContext){
        const data = await regionalServices.read()
        return response.ok(data)
    }

    async actualizar ({request, response}: HttpContext){
        try {
            const data = await regionalServices.actualizar(request)
            return response.ok(data)
        } catch (error) {
            return response.status(404).json({ message: error.message })
        }
    }
}