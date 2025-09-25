import Regionale from '#models/regionale'

export default class RegionalServices {
    async read () {
        const data = await Regionale.all()
        return data
    }

    async actualizar (request: any){
        const requestData = request.all()
        const id = requestData.id
        
        if (!id) {
            throw new Error('El ID es requerido para actualizar la región')
        }
        
        // Extraer solo los campos permitidos, excluyendo el id
        const data = {
            departamentos_iddepartamentos: requestData.departamentos_iddepartamentos,
            regional: requestData.regional,
            telefono: requestData.telefono,
            direccion: requestData.direccion,
            numero_centros: requestData.numero_centros,
            departamentos_iddepartamento: requestData.departamentos_iddepartamento
        }
        
        // Filtrar campos undefined
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        )
        
        const regional = await Regionale.find(id)

        if (!regional) {
            throw new Error('No se encontró la región')
        }

        regional.merge(filteredData)
        await regional.save()

        return regional
    }
}
