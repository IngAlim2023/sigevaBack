import vine from '@vinejs/vine'

export const storeCandidatoValidator = vine.compile(
  vine.object({
    nombres: vine.string().trim().optional(),
    ideleccion: vine.number(),
    idaprendiz: vine.number(),
    propuesta: vine.string().trim(),
    numero_tarjeton: vine.string().trim(),
    foto_url: vine.string().url().optional(),
  })
)
