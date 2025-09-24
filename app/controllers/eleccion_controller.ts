/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import type { HttpContext } from '@adonisjs/core/http'
import Eleccione from '#models/eleccione'
import EleccionService from '#services/EleccionesServices'
import FiltrarService from '#services/FiltroJorElCen'

const eleccionService = new EleccionService()
const filtroElecciones = new FiltrarService()

export default class EleccionControler {
  async traerEleccion({ response }: HttpContext) {
    try {
      const elecciones = await Eleccione.all()
      return response.status(200).json({ message: 'Elecciones traidas con exito', elecciones })
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Error al obtener las elecciones', error: error.message })
    }
  }

  async traerEleccionesActivas({ response }: HttpContext) {
    try {
      const eleccionesActivas = await eleccionService.eleccionesAactivas()
      return response
        .status(200)
        .json({ message: 'Elecciones Activas traidas con exito', eleccionesActivas })
    } catch (error) {
      return response.status(500).json({ message: 'Error en obtener las elecciones activas' })
    }
  }

  async crearEleccion({ request, response }: HttpContext) {
    try {
      const dataEleccion = request.only([
        'idcentro_formacion',
        'jornada',
        'fecha_inicio',
        'fecha_fin',
        'hora_inicio',
        'hora_fin',
        'nombre',
      ])

      if (
        dataEleccion.jornada != 'Mañana' &&
        dataEleccion.jornada != 'Tarde' &&
        dataEleccion.jornada != 'Noche'
      ) {
        return response.status(400).json({ message: 'La jornada no es válida' })
      }

      if (!dataEleccion.idcentro_formacion) {
        return response
          .status(400)
          .json({ message: 'El campo del centro de formacion es obligatorio' })
      }

      if (!dataEleccion.fecha_inicio || !dataEleccion.fecha_fin) {
        return response.status(400).json({ message: 'Los campos de las fechas son obligatorios' })
      }

      if (new Date(dataEleccion.fecha_inicio) > new Date(dataEleccion.fecha_fin)) {
        return response
          .status(400)
          .json({ message: 'La fecha de inicio no debe ser mayor a la fecha fin' })
      }

      if (!dataEleccion.hora_inicio || !dataEleccion.hora_fin) {
        return response
          .status(400)
          .json({ message: 'Los campos de hora inicio y fin son obligatorios' })
      }

      if (new Date(dataEleccion.hora_inicio) > new Date(dataEleccion.hora_fin)) {
        return response
          .status(400)
          .json({ message: 'La Hora de inicio no debe ser mayor a la Hora fin' })
      }

      const eleccion = await Eleccione.create(dataEleccion)
      return response.status(201).json({ message: 'Eleccion creada con exito', eleccion })
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Error al crear la eleccion', error: error.message })
    }
  }

  async actualizarEleccion({ request, response, params }: HttpContext) {
    try {
      const eleccion = await Eleccione.find(params.idEleccion)
      if (!eleccion) {
        return response.status(404).json({ message: 'No se encontro una eleccion en especifico' })
      }

      const dataEleccion = request.only([
        'idcentro_formacion',
        'jornada',
        'fecha_inicio',
        'fecha_fin',
        'hora_inicio',
        'hora_fin',
        'nombre',
      ])

      if (
        dataEleccion.jornada != 'Mañana' &&
        dataEleccion.jornada != 'Tarde' &&
        dataEleccion.jornada != 'Noche'
      ) {
        return response.status(400).json({ message: 'La jornada no es válida' })
      }

      //validaciones fechas inicio y fin
      if (!dataEleccion.fecha_inicio || !dataEleccion.fecha_fin) {
        return response.status(400).json({ message: 'Los campos de las fechas son obligatorios' })
      }

      if (new Date(dataEleccion.fecha_inicio) > new Date(dataEleccion.fecha_fin)) {
        return response
          .status(400)
          .json({ message: 'La fecha de inicio no debe ser mayor a la fecha fin' })
      }

      //validaciones  hora incio y fin
      if (!dataEleccion.hora_inicio || !dataEleccion.hora_fin) {
        return response
          .status(400)
          .json({ message: 'Los campos de hora inicio y fin son obligatorios' })
      }

      if (new Date(dataEleccion.hora_inicio) > new Date(dataEleccion.hora_fin)) {
        return response
          .status(400)
          .json({ message: 'La Hora de inicio no debe ser mayor a la Hora fin' })
      }

      eleccion.merge(dataEleccion)
      await eleccion.save()

      return response.status(200).json({ message: 'Eleccion actualizada con exito', eleccion })
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Error al actualizar la eleccion', error: error.message })
    }
  }

  async traerPorCentroFormacion({ response, params }: HttpContext) {
    try {
      const elecciones = await Eleccione.query()
        .where('idcentro_formacion', params.idCentro_formacion)
        .preload('centro')
        .preload('candidato', (candidatoQuery) => {
          candidatoQuery.preload('aprendiz', (aprendizQuery) => {
            aprendizQuery.preload('grupo').preload('programa')
          })
        })

      let eleccionesActivas: any[] = []

      elecciones.forEach((eleccion) => {
        const fechaInicio = new Date(eleccion.fecha_inicio)
        const fechaFin = new Date(eleccion.fecha_fin)

        const hoy = new Date()
        const soloFechaHoy = hoy.toISOString().split('T')[0]
        const soloFechaInicio = fechaInicio.toISOString().split('T')[0]
        const soloFechaFin = fechaFin.toISOString().split('T')[0]

        const horaInicioDate = new Date(eleccion.hora_inicio as any)
        const horaFinDate = new Date(eleccion.hora_fin as any)

        const minutosInicio = horaInicioDate.getHours() * 60 + horaInicioDate.getMinutes()
        const minutosFin = horaFinDate.getHours() * 60 + horaFinDate.getMinutes()

        const minutosAhora = hoy.getHours() * 60 + hoy.getMinutes()

        if (
          // Caso 1: hoy está entre fechaInicio y fechaFin (excluyendo extremos)
          (soloFechaHoy > soloFechaInicio && soloFechaHoy < soloFechaFin) ||
          // Caso 2: hoy es el mismo día de inicio y de fin (rango en un día)
          (soloFechaHoy === soloFechaInicio &&
            soloFechaHoy === soloFechaFin &&
            minutosAhora >= minutosInicio &&
            minutosAhora <= minutosFin) ||
          // Caso 3: hoy es solo el día de inicio (y ya pasó la hora de inicio)
          (soloFechaHoy === soloFechaInicio &&
            soloFechaHoy < soloFechaFin &&
            minutosAhora >= minutosInicio) ||
          // Caso 4: hoy es solo el día de fin (y aún no pasa la hora de fin)
          (soloFechaHoy === soloFechaFin &&
            soloFechaHoy > soloFechaInicio &&
            minutosAhora <= minutosFin)
        ) {
          //const primerCandidato = eleccion.candidato[0]

          eleccionesActivas.push({
            ideleccion: eleccion.ideleccion,
            titulo: eleccion.nombre,
            fechaInicio: eleccion.fecha_inicio,
            fechaFin: eleccion.fecha_fin,
            centro: eleccion.centro.centro_formacioncol,
            jornada: eleccion.jornada,
            horaInicio: eleccion.hora_inicio,
            horaFin: eleccion.hora_fin,
            //jornada: primerCandidato?.aprendiz?.grupo?.jornada ?? null,
          })
        }
      })

      return response.status(200).json({
        message: 'Elecciones por centros de formacion traidos correctamente',
        eleccionesActivas,
      })
    } catch (error) {
      console.log(error)
      return response
        .status(500)
        .json({ message: 'Error al obtner las elecciones por centro de formacion' })
    }
  }

  async traerPorCentroFormacionTodas({ response, params }: HttpContext) {
    try {
      const elecciones = await Eleccione.query()
        .where('idcentro_formacion', params.idcentro_formacion)
        .preload('centro')
        .preload('candidato', (candidatoQuery) => {
          candidatoQuery.preload('aprendiz', (aprendizQuery) => {
            aprendizQuery.preload('grupo').preload('programa')
          })
        })

      let eleccionesActivas: any[] = []

      elecciones.forEach((eleccion) => {
        eleccionesActivas.push({
          ideleccion: eleccion.ideleccion,
          titulo: eleccion.nombre,
          fechaInicio: eleccion.fecha_inicio,
          fechaFin: eleccion.fecha_fin,
          centro: eleccion.centro.centro_formacioncol,
          jornada: eleccion.jornada,
          horaInicio: eleccion.hora_inicio,
          horaFin: eleccion.hora_fin,
        })
      })

      return response.status(200).json({
        message: 'Elecciones por centros de formacion traidos correctamente',
        eleccionesActivas,
      })
    } catch (error) {
      console.log(error)
      return response
        .status(500)
        .json({ message: 'Error al obtner las elecciones por centro de formacion' })
    }
  }

  async traerPorJornada({ request, response }: HttpContext) {
    try {
      const { jornada } = request.qs()

      const elecciones = await Eleccione.query().preload('candidato', (candidatoQuery) => {
        candidatoQuery.preload('aprendiz', (aprendizQuery) => {
          aprendizQuery.preload('grupo', (grupoQuery) => {
            if (jornada) {
              grupoQuery.where('jornada', jornada)
            }
          })
        })
      })
      return response.status(200).json({ message: 'Elecciones filtradas por jornada', elecciones })
    } catch (error) {
      return response.status(500).json({
        message: 'Error al obtener las eleccioness filtradas pro jornada',
        error: error.message,
      })
    }
  }

  async traerFiltrado({ request, response }: HttpContext) {
    try {
      const { idCentro_formacion, jornada } = request.qs()
      const eleccionesFiltradas = await filtroElecciones.filtroElecciones(
        idCentro_formacion,
        jornada
      )
      return response.status(200).json({
        message: 'Elecciones activas filtradas por jornada y centro formacion exitosamente',
        eleccionesFiltradas,
      })
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Error al filtrar elecciones', error: error.message })
    }
  }

  public async listarEleccionesPorCentroF({ params, response }: HttpContext) {
    try {
      const elecciones = await eleccionService.listarPorCentro(params.idcentro_formacion)

      return response.ok({
        message: 'Elecciones por centro de formación obtenidas correctamente',
        data: elecciones,
      })
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'Error al obtener elecciones por centro de formación',
      })
    }
  }
}
