import vine from '@vinejs/vine'

export const storeCandidatoValidator = vine.compile(
  vine.object({
    nombres: vine.string().trim(),
    ideleccion: vine.number(),
    idaprendiz: vine.number(),
    propuesta: vine.string().trim(),
    numero_tarjeton: vine.number(),
    foto_url: vine.string().url().optional(),
  })
)
