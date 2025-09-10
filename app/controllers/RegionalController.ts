import RegionalesSer from "#services/RegionalesServices";
import type { HttpContext } from "@adonisjs/core/http";


const resSer = new RegionalesSer();

export default class RegionalController{
    async readAll({response}:HttpContext){
        try{
            const regionales = await resSer.read();
    
            return response.status(200).json({regionales})

        }catch(e){
            return response.status(500).json({errores:e.message})
        }
    }
}