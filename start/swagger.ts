import swaggerJSDoc from "swagger-jsdoc"
import router from "@adonisjs/core/services/router"
import app from "@adonisjs/core/services/app"

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "SIGEVA - Sistema de Votaciones SENA",
    version: "1.0.0",
    description: "Documentación de la API del Sistema de Gestión Electoral y Validación de Aprendices",
    contact: {
      name: "Equipo SIGEVA",
      email: "soporte@sigeva.com"
    }
  },
  servers: [
    {
      url: "http://localhost:3333",
      description: "Servidor de desarrollo"
    },
  ],
  tags: [
    {
      name: "Aprendices",
      description: "Gestión de aprendices SENA"
    },
    {
      name: "Candidatos",
      description: "Gestión de candidatos para elecciones"
    },
    {
      name: "Centros de Formación",
      description: "Gestión de centros de formación SENA"
    },
    {
      name: "Elecciones",
      description: "Gestión de elecciones y procesos electorales"
    },
    {
      name: "Grupos",
      description: "Gestión de grupos de formación"
    },
    {
      name: "Municipios",
      description: "Consulta de municipios"
    },
    {
      name: "Niveles de Formación",
      description: "Gestión de niveles de formación"
    },
    {
      name: "Programas de Formación",
      description: "Gestión de programas de formación"
    },
    {
      name: "Regionales",
      description: "Gestión de regionales SENA"
    },
    {
      name: "Reportes",
      description: "Generación de reportes del sistema"
    },
    {
      name: "Usuarios",
      description: "Gestión de usuarios del sistema"
    },
    {
      name: "Validaciones",
      description: "Sistema OTP para validación de votos"
    },
    {
      name: "Votos por Candidato",
      description: "Gestión de votos y resultados"
    },
    {
      name: "Importación",
      description: "Importación de datos desde Excel"
    }
  ],
  paths: {
    // ===== APRENDICES =====
    "/api/aprendiz/crear": {
      post: {
        summary: "Crear nuevo aprendiz",
        tags: ["Aprendices"],
        description: "Registra un nuevo aprendiz en el sistema",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nombres: { type: "string", example: "Juan Carlos" },
                  apellidos: { type: "string", example: "Pérez González" },
                  email: { type: "string", format: "email", example: "juan.perez@sena.edu.co" },
                  documento: { type: "string", example: "1234567890" },
                  centro_formacion_id: { type: "integer", example: 1 }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Aprendiz creado exitosamente" },
          "400": { description: "Error de validación" }
        }
      }
    },
    "/api/aprendiz/listar": {
      get: {
        summary: "Listar todos los aprendices",
        tags: ["Aprendices"],
        description: "Obtiene una lista de todos los aprendices registrados",
        responses: {
          "200": {
            description: "Lista de aprendices obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      nombres: { type: "string", example: "Juan Carlos" },
                      apellidos: { type: "string", example: "Pérez González" },
                      email: { type: "string", example: "juan.perez@sena.edu.co" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/aprendiz/centros/{idCentro}": {
      get: {
        summary: "Obtener aprendices por centro de formación",
        tags: ["Aprendices"],
        parameters: [
          {
            in: "path",
            name: "idCentro",
            required: true,
            schema: { type: "integer" },
            description: "ID del centro de formación"
          }
        ],
        responses: {
          "200": { description: "Aprendices del centro obtenidos exitosamente" }
        }
      }
    },
    "/api/aprendiz/actualizar/{id}": {
      put: {
        summary: "Actualizar aprendiz",
        tags: ["Aprendices"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
            description: "ID del aprendiz"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nombres: { type: "string" },
                  apellidos: { type: "string" },
                  email: { type: "string", format: "email" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Aprendiz actualizado exitosamente" },
          "404": { description: "Aprendiz no encontrado" }
        }
      }
    },
    "/api/aprendiz/login": {
      post: {
        summary: "Login de aprendiz",
        tags: ["Aprendices"],
        description: "Autenticación de aprendiz en el sistema",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "juan.perez@sena.edu.co" },
                  password: { type: "string", example: "password123" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Login exitoso" },
          "401": { description: "Credenciales inválidas" }
        }
      }
    },
    "/api/aprendiz/actualizar/contrasena": {
      put: {
        summary: "Actualizar contraseña de aprendiz",
        tags: ["Aprendices"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  nueva_password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Contraseña actualizada exitosamente" }
        }
      }
    },

    // ===== CANDIDATOS =====
    "/api/candidatos/crear": {
      post: {
        summary: "Crear nuevo candidato",
        tags: ["Candidatos"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  aprendiz_id: { type: "integer", example: 1 },
                  eleccion_id: { type: "integer", example: 1 },
                  propuestas: { type: "string", example: "Mejorar la infraestructura del centro" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Candidato creado exitosamente" }
        }
      }
    },
    "/api/candidatos/listar/{ideleccion}": {
      get: {
        summary: "Obtener candidatos por elección",
        tags: ["Candidatos"],
        parameters: [
          {
            in: "path",
            name: "ideleccion",
            required: true,
            schema: { type: "integer" },
            description: "ID de la elección"
          }
        ],
        responses: {
          "200": { description: "Candidatos obtenidos exitosamente" }
        }
      }
    },
    "/api/candidatos/listar": {
      get: {
        summary: "Listar todos los candidatos",
        tags: ["Candidatos"],
        responses: {
          "200": { description: "Lista de candidatos obtenida exitosamente" }
        }
      }
    },
    "/api/candidatos/actualizar/{id}": {
      put: {
        summary: "Actualizar candidato",
        tags: ["Candidatos"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": { description: "Candidato actualizado exitosamente" }
        }
      }
    },
    "/api/candidatos/eliminar/{id}": {
      delete: {
        summary: "Eliminar candidato",
        tags: ["Candidatos"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": { description: "Candidato eliminado exitosamente" }
        }
      }
    },

    // ===== CENTROS DE FORMACIÓN =====
    "/api/centrosFormacion/crear": {
      post: {
        summary: "Crear centro de formación",
        tags: ["Centros de Formación"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nombre: { type: "string", example: "Centro de Biotecnología Agropecuaria" },
                  codigo: { type: "string", example: "CBA" },
                  regional_id: { type: "integer", example: 1 }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Centro creado exitosamente" }
        }
      }
    },
    "/api/centrosFormacion/obtiene": {
      get: {
        summary: "Obtener todos los centros de formación",
        tags: ["Centros de Formación"],
        responses: {
          "200": { description: "Centros obtenidos exitosamente" }
        }
      }
    },
    "/api/centrosFormacion/{id}": {
      put: {
        summary: "Actualizar centro de formación",
        tags: ["Centros de Formación"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": { description: "Centro actualizado exitosamente" }
        }
      }
    },

    // ===== ELECCIONES =====
    "/api/eleccion": {
      get: {
        summary: "Obtener todas las elecciones",
        tags: ["Elecciones"],
        responses: {
          "200": { description: "Elecciones obtenidas exitosamente" }
        }
      }
    },
    "/api/eleccionPorCentro/{idCentro_formacion}": {
      get: {
        summary: "Obtener elecciones por centro de formación",
        tags: ["Elecciones"],
        parameters: [
          {
            in: "path",
            name: "idCentro_formacion",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": { description: "Elecciones del centro obtenidas exitosamente" }
        }
      }
    },
    "/api/eleccion/traerFiltro": {
      get: {
        summary: "Obtener elecciones filtradas",
        tags: ["Elecciones"],
        responses: {
          "200": { description: "Elecciones filtradas obtenidas exitosamente" }
        }
      }
    },
    "/api/eleccionJornada/listar": {
      get: {
        summary: "Obtener elecciones por jornada",
        tags: ["Elecciones"],
        responses: {
          "200": { description: "Elecciones por jornada obtenidas exitosamente" }
        }
      }
    },
    "/api/eleccion/crear": {
      post: {
        summary: "Crear nueva elección",
        tags: ["Elecciones"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nombre: { type: "string", example: "Elección Representante Estudiantil 2025" },
                  fecha_inicio: { type: "string", format: "date", example: "2025-09-20" },
                  fecha_fin: { type: "string", format: "date", example: "2025-09-25" },
                  centro_formacion_id: { type: "integer", example: 1 }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Elección creada exitosamente" }
        }
      }
    },
    "/api/eleccionActualizar/{idEleccion}": {
      put: {
        summary: "Actualizar elección",
        tags: ["Elecciones"],
        parameters: [
          {
            in: "path",
            name: "idEleccion",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": { description: "Elección actualizada exitosamente" }
        }
      }
    },

    // ===== REGIONALES =====
    "/api/regionales": {
      get: {
        summary: "Obtener todas las regionales SENA",
        tags: ["Regionales"],
        description: "Retorna una lista de todas las regionales del SENA registradas en el sistema",
        responses: {
          "200": {
            description: "Lista de regionales obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Regionales obtenidas exitosamente"
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer", example: 1 },
                          nombre: { type: "string", example: "Regional Antioquia" },
                          codigo: { type: "string", example: "ANT" },
                          estado: { type: "string", example: "activo" }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "500": {
            description: "Error interno del servidor"
          }
        }
      }
    },
    "/api/regionales/actualizar": {
      put: {
        summary: "Actualizar información de regionales",
        tags: ["Regionales"],
        description: "Actualiza la información de una regional en el sistema",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  nombre: { type: "string", example: "Regional Antioquia Actualizada" },
                  codigo: { type: "string", example: "ANT_UPD" },
                  estado: { type: "string", enum: ["activo", "inactivo"], example: "activo" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Regional actualizada exitosamente"
          },
          "400": {
            description: "Error de validación de datos"
          },
          "404": {
            description: "Regional no encontrada"
          }
        }
      }
    },
    "/api/validaciones": {
      get: {
        summary: "Obtener todas las validaciones de voto",
        tags: ["Validaciones"],
        description: "Retorna una lista de todas las validaciones de voto registradas en el sistema",
        responses: {
          "200": {
            description: "Lista de validaciones obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Validaciones obtenidas exitosamente" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer", example: 1 },
                          codigo: { type: "string", example: "USED_ABC123" },
                          aprendiz_idaprendiz: { type: "integer", example: 1 },
                          elecciones_ideleccion: { type: "integer", example: 1 }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/validaciones/{id}": {
      get: {
        summary: "Obtener validación específica por ID",
        tags: ["Validaciones"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
            description: "ID de la validación"
          }
        ],
        responses: {
          "200": {
            description: "Validación obtenida exitosamente"
          },
          "404": {
            description: "Validación no encontrada"
          }
        }
      }
    },
    "/api/validaciones/generarOtp": {
      post: {
        summary: "Generar código OTP para votación",
        tags: ["Validaciones"],
        description: "Genera un código OTP único y lo envía por email al aprendiz",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["aprendiz_idaprendiz", "elecciones_ideleccion"],
                properties: {
                  aprendiz_idaprendiz: { type: "integer", example: 1 },
                  elecciones_ideleccion: { type: "integer", example: 1 }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OTP generado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Código OTP generado exitosamente" },
                    data: {
                      type: "object",
                      properties: {
                        otp_generado: { type: "boolean", example: true },
                        email_enviado_a: { type: "string", example: "aprendiz@sena.edu.co" },
                        expira_en_minutos: { type: "integer", example: 5 }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Error de validación"
          },
          "404": {
            description: "Aprendiz o elección no encontrados"
          }
        }
      }
    },
    "/api/validaciones/validarOtp": {
      post: {
        summary: "Validar código OTP",
        tags: ["Validaciones"],
        description: "Valida un código OTP previamente generado",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["codigo_otp"],
                properties: {
                  codigo_otp: { 
                    type: "string", 
                    minLength: 6, 
                    maxLength: 6, 
                    example: "ABC123" 
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Respuesta de validación",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Código OTP validado correctamente" },
                    data: {
                      type: "object",
                      properties: {
                        aprendiz_id: { type: "integer", example: 1 },
                        eleccion_id: { type: "integer", example: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ===== GRUPOS =====
    "/api/grupo/crear": {
      post: {
        summary: "Crear nuevo grupo",
        tags: ["Grupos"],
        responses: { "201": { description: "Grupo creado exitosamente" } }
      }
    },
    "/api/grupo/listar": {
      get: {
        summary: "Listar todos los grupos",
        tags: ["Grupos"],
        responses: { "200": { description: "Grupos obtenidos exitosamente" } }
      }
    },
    "/api/grupo/listar/{id}": {
      get: {
        summary: "Obtener grupo por ID",
        tags: ["Grupos"],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Grupo obtenido exitosamente" } }
      },
      put: {
        summary: "Actualizar grupo",
        tags: ["Grupos"],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Grupo actualizado exitosamente" } }
      }
    },

    // ===== MUNICIPIOS =====
    "/api/municipios": {
      get: {
        summary: "Consultar municipios",
        tags: ["Municipios"],
        responses: { "200": { description: "Municipios obtenidos exitosamente" } }
      }
    },

    // ===== NIVELES DE FORMACIÓN =====
    "/api/nivel/crear": {
      post: {
        summary: "Crear nivel de formación",
        tags: ["Niveles de Formación"],
        responses: { "201": { description: "Nivel creado exitosamente" } }
      }
    },
    "/api/nivel/listar": {
      get: {
        summary: "Listar niveles de formación",
        tags: ["Niveles de Formación"],
        responses: { "200": { description: "Niveles obtenidos exitosamente" } }
      }
    },
    "/api/nivel/listar/{id}": {
      get: {
        summary: "Obtener nivel por ID",
        tags: ["Niveles de Formación"],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Nivel obtenido exitosamente" } }
      }
    },
    "/api/nivel/actualizar/{id}": {
      put: {
        summary: "Actualizar nivel de formación",
        tags: ["Niveles de Formación"],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Nivel actualizado exitosamente" } }
      }
    },

    // ===== PROGRAMAS DE FORMACIÓN =====
    "/api/programasFormacion/listar": {
      get: {
        summary: "Listar programas de formación",
        tags: ["Programas de Formación"],
        responses: { "200": { description: "Programas obtenidos exitosamente" } }
      }
    },
    "/api/programasFormacion/crear": {
      post: {
        summary: "Crear programa de formación",
        tags: ["Programas de Formación"],
        responses: { "201": { description: "Programa creado exitosamente" } }
      }
    },
    "/api/programasFormacion/actualizar/{id}": {
      put: {
        summary: "Actualizar programa de formación",
        tags: ["Programas de Formación"],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Programa actualizado exitosamente" } }
      }
    },

    // ===== REPORTES =====
    "/reportes": {
      get: {
        summary: "Generar reportes filtrados",
        tags: ["Reportes"],
        responses: { "200": { description: "Reporte generado exitosamente" } }
      }
    },

    // ===== USUARIOS =====
    "/api/usuarios/crear": {
      post: {
        summary: "Crear nuevo usuario",
        tags: ["Usuarios"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nombre: { type: "string", example: "Admin Usuario" },
                  email: { type: "string", format: "email", example: "admin@sena.edu.co" },
                  password: { type: "string", example: "password123" },
                  rol: { type: "string", example: "administrador" }
                }
              }
            }
          }
        },
        responses: { "201": { description: "Usuario creado exitosamente" } }
      }
    },
    "/api/usuarios/login": {
      post: {
        summary: "Login de usuario",
        tags: ["Usuarios"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@sena.edu.co" },
                  password: { type: "string", example: "password123" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Login exitoso" },
          "401": { description: "Credenciales inválidas" }
        }
      }
    },
    "/api/usuarios/{id}": {
      put: {
        summary: "Actualizar usuario",
        tags: ["Usuarios"],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Usuario actualizado exitosamente" } }
      }
    },
    "/api/usuarios/funcionarios": {
      get: {
        summary: "Listar funcionarios",
        tags: ["Usuarios"],
        responses: { "200": { description: "Funcionarios obtenidos exitosamente" } }
      }
    },

    // ===== VOTOS POR CANDIDATO =====
    "/api/votoXCandidato/traer": {
      get: {
        summary: "Obtener todos los votos",
        tags: ["Votos por Candidato"],
        responses: { "200": { description: "Votos obtenidos exitosamente" } }
      }
    },
    "/api/votoXCandidato/cantidad/{id}": {
      get: {
        summary: "Obtener cantidad de votos por candidato",
        tags: ["Votos por Candidato"],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Cantidad de votos obtenida exitosamente" } }
      }
    },
    "/api/votoXCandidato/crear": {
      post: {
        summary: "Registrar voto",
        tags: ["Votos por Candidato"],
        description: "Registra un voto para un candidato (requiere validación previa)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  candidato_id: { type: "integer", example: 1 },
                  aprendiz_id: { type: "integer", example: 1 },
                  eleccion_id: { type: "integer", example: 1 }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Voto registrado exitosamente" },
          "400": { description: "Error de validación" },
          "403": { description: "Voto no permitido" }
        }
      }
    },

    // ===== IMPORTACIÓN =====
    "/api/aprendices/importarExcel": {
      post: {
        summary: "Importar aprendices desde Excel",
        tags: ["Importación"],
        description: "Importa una lista de aprendices desde un archivo Excel",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  archivo: {
                    type: "string",
                    format: "binary",
                    description: "Archivo Excel con datos de aprendices"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Aprendices importados exitosamente" },
          "400": { description: "Error en el formato del archivo" }
        }
      }
    }
  }
}

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [] // No necesitamos archivos externos ya que definimos todo arriba
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)

// Ruta principal para Swagger UI
router.get("/docs", async ({ response }) => {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>SIGEVA API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
      html {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }
      *, *:before, *:after {
        box-sizing: inherit;
      }
      body {
        margin:0;
        background: #fafafa;
      }
      .swagger-ui .topbar { display: none }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function() {
        const ui = SwaggerUIBundle({
          url: '/docs-json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout"
        });
      };
    </script>
  </body>
</html>`
  
  response.header("Content-Type", "text/html")
  response.send(html)
})

// Endpoint JSON para obtener la especificación
router.get("/docs-json", async ({ response }) => {
  response.header("Content-Type", "application/json")
  return swaggerDocs
})

// Endpoint de debug para ver qué rutas se están cargando
router.get("/docs-debug", async ({ response }) => {
  response.header("Content-Type", "application/json")
  return {
    paths: Object.keys((swaggerDocs as any).paths || {}),
    apis: [
      app.appRoot + "/start/routes/*.js",
      app.appRoot + "/start/routes/*.ts"
    ],
    appRoot: app.appRoot
  }
})

export default swaggerDocs
