import router from '@adonisjs/core/services/router'
import ValidacionVotoController from '#controllers/validacionVotoController'

const validacionVotoController = new ValidacionVotoController()

/**
 * @swagger
 * /api/validaciones:
 *   get:
 *     summary: Obtener todas las validaciones de voto
 *     tags: [Validaciones]
 *     description: Retorna una lista de todas las validaciones de voto registradas en el sistema
 *     responses:
 *       200:
 *         description: Lista de validaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validaciones obtenidas exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       codigo:
 *                         type: string
 *                         example: "USED_ABC123"
 *                       aprendiz_idaprendiz:
 *                         type: integer
 *                         example: 1
 *                       elecciones_ideleccion:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-15T10:30:00.000Z"
 *       500:
 *         description: Error interno del servidor
 */
router.get('/api/validaciones', validacionVotoController.index)

/**
 * @swagger
 * /api/validaciones/{id}:
 *   get:
 *     summary: Obtener validación específica por ID
 *     tags: [Validaciones]
 *     description: Retorna los detalles de una validación específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la validación
 *         example: 1
 *     responses:
 *       200:
 *         description: Validación obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validación obtenida exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     codigo:
 *                       type: string
 *                       example: "USED_ABC123"
 *                     aprendiz_idaprendiz:
 *                       type: integer
 *                       example: 1
 *                     elecciones_ideleccion:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Validación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/api/validaciones/:id', validacionVotoController.show)

/**
 * @swagger
 * /api/validaciones/generarOtp:
 *   post:
 *     summary: Generar código OTP para votación
 *     tags: [Validaciones]
 *     description: |
 *       Genera un código OTP único y lo envía por email al aprendiz.
 *       
 *       **Validaciones realizadas:**
 *       - Aprendiz existe y está activo
 *       - Elección existe y está en período válido
 *       - Aprendiz y elección pertenecen al mismo centro
 *       - Aprendiz no ha votado previamente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aprendiz_idaprendiz
 *               - elecciones_ideleccion
 *             properties:
 *               aprendiz_idaprendiz:
 *                 type: integer
 *                 minimum: 1
 *                 description: ID del aprendiz que solicita el OTP
 *                 example: 1
 *               elecciones_ideleccion:
 *                 type: integer
 *                 minimum: 1
 *                 description: ID de la elección en la que desea votar
 *                 example: 1
 *           example:
 *             aprendiz_idaprendiz: 1
 *             elecciones_ideleccion: 1
 *     responses:
 *       200:
 *         description: OTP generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Código OTP generado exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     otp_generado:
 *                       type: boolean
 *                       example: true
 *                     email_enviado_a:
 *                       type: string
 *                       format: email
 *                       example: "aprendiz@sena.edu.co"
 *                     expira_en_minutos:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Error de validación o reglas de negocio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El aprendiz debe estar en estado activo para votar"
 *                 codigo_error:
 *                   type: string
 *                   example: "APRENDIZ_INACTIVO"
 *       404:
 *         description: Aprendiz o elección no encontrados
 *       500:
 *         description: Error interno del servidor
 */
router.post('/api/validaciones/generarOtp', validacionVotoController.generarOtp)

/**
 * @swagger
 * /api/validaciones/validarOtp:
 *   post:
 *     summary: Validar código OTP
 *     tags: [Validaciones]
 *     description: |
 *       Valida un código OTP previamente generado.
 *       
 *       **Proceso de validación:**
 *       1. Busca el código en la base de datos
 *       2. Verifica que no haya expirado
 *       3. Marca el código como usado (prefijo USED_)
 *       4. Retorna success true/false
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo_otp
 *             properties:
 *               codigo_otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 pattern: '^[A-Z0-9]{6}$'
 *                 description: Código OTP de 6 caracteres alfanuméricos en mayúsculas
 *                 example: "ABC123"
 *           example:
 *             codigo_otp: "ABC123"
 *     responses:
 *       200:
 *         description: Respuesta de validación (exitosa o fallida)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la validación fue exitosa
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Mensaje descriptivo del resultado
 *                   example: "Código OTP validado correctamente"
 *                 data:
 *                   type: object
 *                   description: Datos adicionales (solo si success=true)
 *                   properties:
 *                     aprendiz_id:
 *                       type: integer
 *                       example: 1
 *                     eleccion_id:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Error de validación de datos de entrada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/api/validaciones/validarOtp', validacionVotoController.validarOtp)
