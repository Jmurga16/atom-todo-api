import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env.config';

/**
 * Configuración de Swagger/OpenAPI
 * Documentación interactiva de la API
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ATOM Todo API',
    version: '1.0.0',
    description: `
Backend API para la aplicación de gestión de tareas (TODO List).

Desarrollado con:
- Express.js + TypeScript
- Firebase Firestore
- Arquitectura Hexagonal/Limpia
- Patrones: Repository, Factory, Singleton, DDD

## Características
- CRUD completo de tareas
- Gestión de usuarios
- Validación robusta de datos
- Manejo centralizado de errores
- CORS configurado
    `,
    contact: {
      name: 'ATOM Challenge',
      url: 'https://github.com/Jmurga16/atom-todo-api',
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: 'Development server',
    },
    {
      url: 'https://api-rpdq2m3giq-uc.a.run.app',
      description: 'Production server (Cloud Run)',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Tasks',
      description: 'Task management endpoints',
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User ID (auto-generated)',
            example: 'abc123xyz',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'user@example.com',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
            example: '2024-01-15T10:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2024-01-15T10:00:00.000Z',
          },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Task ID (auto-generated)',
            example: 'task123',
          },
          userId: {
            type: 'string',
            description: 'ID of the user who owns this task',
            example: 'user123',
          },
          title: {
            type: 'string',
            description: 'Task title',
            example: 'Complete the challenge',
            minLength: 1,
            maxLength: 100,
          },
          description: {
            type: 'string',
            description: 'Task description',
            example: 'Develop the API with Express and TypeScript',
            maxLength: 500,
          },
          completed: {
            type: 'boolean',
            description: 'Task completion status',
            example: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
            example: '2024-01-15T10:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2024-01-15T10:00:00.000Z',
          },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'newuser@example.com',
          },
        },
      },
      CreateTaskRequest: {
        type: 'object',
        required: ['userId', 'title'],
        properties: {
          userId: {
            type: 'string',
            description: 'ID of the user who owns this task',
            example: 'user123',
          },
          title: {
            type: 'string',
            description: 'Task title',
            example: 'New task',
            minLength: 1,
            maxLength: 100,
          },
          description: {
            type: 'string',
            description: 'Task description (optional)',
            example: 'Task description',
            maxLength: 500,
          },
        },
      },
      UpdateTaskRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Task title',
            example: 'Updated title',
            minLength: 1,
            maxLength: 100,
          },
          description: {
            type: 'string',
            description: 'Task description',
            example: 'Updated description',
            maxLength: 500,
          },
          completed: {
            type: 'boolean',
            description: 'Task completion status',
            example: true,
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Operation successful',
          },
          data: {
            type: 'object',
            description: 'Response data',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  // Rutas donde buscar anotaciones JSDoc
  apis: ['./src/application/routes/*.ts', './src/application/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
