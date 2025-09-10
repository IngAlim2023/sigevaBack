/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import type { HttpContext } from "@adonisjs/core/http";
import Eleccione from "#models/eleccione";



export default class EleccionControler {

    async traerEleccion({response}:HttpContext){
        try{
            const elecciones = await Eleccione.all()
            return response.status(200).json({message: 'Elecciones traidas con exito', elecciones })
        }catch(error){
            return response.status(500).json({message: 'Error al obtener las elecciones', error: error.message})
        }
    }

    async crearEleccion({request, response}:HttpContext){
        try{
            const dataEleccion = request.only([
                'idCentro_formacion',
                'fecha_inicio',
                'fecha_fin',
                'hora_inicio',
                'hora_fin',
                'nombre'
            ])

            if(!dataEleccion.idCentro_formacion){
                return response.status(400).json({message: 'El campo del centro de formacion es obligatorio'})
            }

            if(!dataEleccion.fecha_inicio || !dataEleccion.fecha_fin){
                return response.status(400).json({message: 'Los campos de las fechas son obligatorios'})
            }

            if(new Date(dataEleccion.fecha_inicio) > new Date(dataEleccion.fecha_fin)){
                return response.status(400).json({message: 'La fecha de inicio no debe ser mayor a la fecha fin'})
            }
            

            if(!dataEleccion.hora_inicio || !dataEleccion.hora_fin){
                return response.status(400).json({message: 'Los campos de hora inicio y fin son obligatorios'})
            }

            
            if(new Date(dataEleccion.hora_inicio) > new Date(dataEleccion.hora_fin)){
                return response.status(400).json({message: 'La Hora de inicio no debe ser mayor a la Hora fin'})
            }

            const eleccion = await Eleccione.create(dataEleccion)
            return response.status(201).json({message: 'Eleccion creada con exito', eleccion })
        }
        catch(error){
            return response.status(500).json({message: 'Error al crear la eleccion', error: error.message})
        }
    }

    async actualizarEleccion({request, response, params}:HttpContext){
        try{
            const eleccion = await Eleccione.find(params.idEleccion)
            if(!eleccion){
                return response.status(404).json({message: 'No se encontro una eleccion en especifico'})
            }

            const dataEleccion = request.only([
                'idCentro_formacion',
                'fecha_inicio',
                'fecha_fin',
                'hora_inicio',
                'hora_fin',
                'nombre'
            ])
           
            //validaciones fechas inicio y fin
            if(!dataEleccion.fecha_inicio || !dataEleccion.fecha_fin){
                return response.status(400).json({message: 'Los campos de las fechas son obligatorios'})
            }

            if(new Date(dataEleccion.fecha_inicio) > new Date(dataEleccion.fecha_fin)){
                return response.status(400).json({message: 'La fecha de inicio no debe ser mayor a la fecha fin'})
            }

            //validaciones  hora incio y fin
            if(!dataEleccion.hora_inicio || !dataEleccion.hora_fin){
                return response.status(400).json({message: 'Los campos de hora inicio y fin son obligatorios'})
            }

            if(new Date(dataEleccion.hora_inicio) > new Date(dataEleccion.hora_fin)){
                return response.status(400).json({message: 'La Hora de inicio no debe ser mayor a la Hora fin'})
            }

            eleccion.merge(dataEleccion)
            await eleccion.save()

            return response.status(200).json({message: 'Eleccion actualizada con exito', eleccion})
        }catch(error){
            return response.status(500).json({message: 'Error al actualizar la eleccion', error: error.message})
        }
        
    }

   async traerPorCentroFormacion({response, params}:HttpContext){
        try {
            const eleccion = await Eleccione.query().where('idCentro_formacion', params.idCentro_formacion)
            return response.status(200).json({message: 'Elecciones por centros de formacion traidos correctamente', eleccion})
        } catch (error) {
            return response.status(500).json({message: 'Error al obtner las elecciones por centro de formacion'})
        }
   }


}