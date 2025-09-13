// import type { HttpContext } from '@adonisjs/core/http'

import Aprendiz from '#models/aprendiz'
import { HttpContext } from '@adonisjs/core/http'
import Grupo from '#models/grupo'
import ProgramaFormacion from '#models/programa_formacion'
import NivelFormacion from '#models/nivel_formacion'
import db from '@adonisjs/lucid/services/db'
import Perfil from '#models/perfil'

//contraseña
import bcrypt from 'bcrypt'

export default class AprendizsController {
  async registro({ request, response }: HttpContext) {
    const trx = await db.transaction()

    try {
      const data = request.only([
        'grupo',
        'jornada',
        'programa',
        'codigo_programa',
        'version',
        'duracion',
        'idnivel_formacion',
        'idarea_tematica',
        'perfil_idperfil',
        'nombres',
        'apellidos',
        'celular',
        'estado',
        'tipo_documento',
        'numero_documento',
        'email',
        'password',
        'nivel_formacion',
        'centro_formacion_idcentro_formacion',
      ])

      // Verificar si el email ya existe
      const emailExist = await Aprendiz.findBy('email', data.email)
      if (emailExist) {
        await trx.rollback()
        return response.status(400).json({
          message: 'El correo ya está registrado',
        })
      }

      // Buscar o crear grupo
      let grupo = await Grupo.query({ client: trx }).where('grupo', data.grupo).first()
      if (!grupo) {
        grupo = await Grupo.create({ grupo: data.grupo, jornada: data.jornada }, { client: trx })
      }

      // Buscar o crear nivel
      let nivel = await NivelFormacion.query({ client: trx })
        .where('idnivel_formacion', data.idnivel_formacion)
        .first()

      if (!nivel) {
        nivel = await NivelFormacion.create(
          {
            idnivel_formacion: data.idnivel_formacion,
            nivel_formacion: data.nivel_formacion,
          },
          { client: trx }
        )
      }

      // Buscar o crear programa
      let programa = await ProgramaFormacion.query({ client: trx })
        .where('codigo_programa', data.codigo_programa)
        .first()

      if (!programa) {
        programa = await ProgramaFormacion.create(
          {
            programa: data.programa,
            codigo_programa: data.codigo_programa,
            version: data.version,
            duracion: data.duracion,
            idnivel_formacion: nivel.idnivel_formacion,
            idarea_tematica: data.idarea_tematica,
          },
          { client: trx }
        )
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(data.password, 10)
      let perfilaprendiz = await Perfil.query({ client: trx }).where('perfil', 'aprendiz').first()
      if (!perfilaprendiz) {
        perfilaprendiz = await Perfil.create({ perfil: 'Aprendiz' }, { client: trx })
      }

      // Crear aprendiz solo con sus campos
      const aprendiz = await Aprendiz.create(
        {
          perfil_idperfil: perfilaprendiz.idperfil,

          nombres: data.nombres,
          apellidos: data.apellidos,
          celular: data.celular,
          estado: data.estado,
          tipo_documento: data.tipo_documento,
          numero_documento: data.numero_documento,
          email: data.email,
          password: hashedPassword,
          idgrupo: grupo.idgrupo,
          idprograma_formacion: programa.idprograma_formacion,
          centro_formacion_idcentro_formacion: data.centro_formacion_idcentro_formacion,
        },
        { client: trx }
      )

      await trx.commit()

      return response.created({
        message: 'Aprendiz creado con éxito',
        data: aprendiz,
      })
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({
        message: 'Error al registrar aprendiz',
        error: error.message,
      })
    }
  }

  async traer({ response }: HttpContext) {
    try {
      const aprendices = await Aprendiz.all()
      return response.ok(aprendices)
    } catch (error) {
      return response.status(500).send({
        message: 'Error al obtener aprendices',
        error: error.message,
      })
    }
  }

  async actualizar({ request, response, params }: HttpContext) {
    try {
      const id = params.id
      const aprendiz = await Aprendiz.find(id)

      if (!aprendiz) {
        return response.status(404).json({ message: 'Aprendiz no encontrado' })
      }

      const data = request.only([
        'idgrupo',
        'idprograma_formacion',
        'perfil_idperfil',
        'nombres',
        'apellidos',
        'celular',
        'estado',
        'tipo_documento',
        'numero_documento',
        'email',
        'password',
      ])

      // Verificar email si se cambió
      if (data.email && data.email !== aprendiz.email) {
        const emailExist = await Aprendiz.findBy('email', data.email)
        if (emailExist) {
          return response.status(400).json({
            message: 'El correo ya está registrado, por favor usa otro',
          })
        }
      }

      // Hash de contraseña solo si se proporciona
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
      }

      aprendiz.merge(data)
      await aprendiz.save()

      return response.ok({
        message: 'Aprendiz actualizado con éxito',
        data: aprendiz,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error al actualizar aprendiz',
        error: error.message,
      })
    }
  }

  async actualizarContrasena({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      if (!password || !email) {
        return response.status(400).json({ message: 'Debes enviar la nueva contraseña' })
      }

      const aprendiz = await Aprendiz.findBy('email', email)

      if (!aprendiz) {
        return response.status(404).json({ message: 'Aprendiz no encontrado' })
      }

      // Hashear la nueva contraseña
      aprendiz.password = await bcrypt.hash(password, 10)
      await aprendiz.save()

      return response.ok({ message: 'Contraseña actualizada con éxito' })
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Error al actualizar la contraseña', error: error.message })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const aprendizExist = await Aprendiz.query()
        .where('email', email)
        .preload('perfil')
        .preload('grupo')
        .first()

      if (!aprendizExist)
        return response.status(401).json({ success: false, message: 'Fallo en la autenticación' })

      const verifyPassword = await bcrypt.compare(password, aprendizExist.password)

      if (!verifyPassword)
        return response.status(401).json({ success: false, message: 'Fallo en la autenticación' })

      return response.status(200).json({
        success: true,
        message: 'Autenticado',
        data: {
          id: aprendizExist.idaprendiz,
          nombre: aprendizExist.nombres,
          apellidos: aprendizExist.apellidos,
          estado: aprendizExist.estado,
          perfil: aprendizExist.perfil.perfil,
          jornada: aprendizExist.grupo?.jornada || null,
          CentroFormacion: aprendizExist.centro_formacion_idcentro_formacion,
        },
      })
    } catch (e) {
      return response.status(500).json({ message: 'Error', error: e.message })
    }
  }
  async aprendicesPorCentro({ params, request, response }: HttpContext) {
    try {
      const idCentro = Number(params.idCentro)
      const { page = 1, perPage = 20, estado, search } = request.qs()

      const query = Aprendiz.query()
        .where('centro_formacion_idcentro_formacion', idCentro)
        .preload('grupo')
        .preload('programa')
        .preload('perfil')

      if (estado) {
        query.where('estado', estado)
      }

      if (search) {
        query.where((builder) => {
          builder
            .whereILike('nombres', `%${search}%`)
            .orWhereILike('apellidos', `%${search}%`)
            .orWhereILike('email', `%${search}%`)
            .orWhere('numero_documento', search)
        })
      }

      const result = await query.orderBy('apellidos', 'asc').paginate(Number(page), Number(perPage))
      const { data } = result.toJSON()
      return response.ok(data)
    } catch (error) {
      console.error('Error al traer aprendices por centro:', error)
      return response.status(500).json({
        message: 'Error al traer aprendices por centro de formación',
        error: error.message,
      })
    }
  }
}
