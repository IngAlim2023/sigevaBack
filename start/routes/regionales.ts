import RegionalController from "#controllers/regionalesController";
import router from "@adonisjs/core/services/router";

const regionalController = new RegionalController()

/**
 * @swagger
 * /api/regionales:
 *   get:
 *     summary: Obtener todas las regionales SENA
 *     tags: [Regionales]
 *     description: Retorna una lista de todas las regionales del SENA registradas en el sistema
 *     responses:
 *       200:
 *         description: Lista de regionales obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Regionales obtenidas exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID único de la regional
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         description: Nombre de la regional
 *                         example: "Regional Antioquia"
 *                       codigo:
 *                         type: string
 *                         description: Código identificador de la regional
 *                         example: "ANT"
 *                       estado:
 *                         type: string
 *                         description: Estado de la regional (activo/inactivo)
 *                         example: "activo"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha de creación
 *                         example: "2025-01-15T10:30:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha de última actualización
 *                         example: "2025-01-15T10:30:00.000Z"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener las regionales"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/api/regionales', regionalController.read)

/**
 * @swagger
 * /api/regionales/actualizar:
 *   put:
 *     summary: Actualizar información de regionales
 *     tags: [Regionales]
 *     description: Actualiza la información de una o múltiples regionales en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID de la regional a actualizar
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre de la regional
 *                 example: "Regional Antioquia Actualizada"
 *               codigo:
 *                 type: string
 *                 description: Nuevo código de la regional
 *                 example: "ANT_UPD"
 *               estado:
 *                 type: string
 *                 enum: [activo, inactivo]
 *                 description: Nuevo estado de la regional
 *                 example: "activo"
 *           example:
 *             id: 1
 *             nombre: "Regional Antioquia Actualizada"
 *             codigo: "ANT_UPD"
 *             estado: "activo"
 *     responses:
 *       200:
 *         description: Regional actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Regional actualizada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Regional Antioquia Actualizada"
 *                     codigo:
 *                       type: string
 *                       example: "ANT_UPD"
 *                     estado:
 *                       type: string
 *                       example: "activo"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-16T14:30:00.000Z"
 *       400:
 *         description: Error de validación de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos de entrada inválidos"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "nombre"
 *                       message:
 *                         type: string
 *                         example: "El nombre es requerido"
 *       404:
 *         description: Regional no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Regional no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar la regional"
 *                 error:
 *                   type: string
 *                   example: "Database update failed"
 */
router.put('/api/regionales/actualizar', regionalController.actualizar)


