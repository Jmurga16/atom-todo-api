import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { corsMiddleware } from './application/middlewares/cors.middleware';
import { errorHandler, notFoundHandler } from './application/middlewares/error.middleware';
import { createRoutes } from './application/routes';
import { UserController } from './application/controllers/UserController';
import { TaskController } from './application/controllers/TaskController';
import { UserService } from './domain/use-cases/UserService';
import { TaskService } from './domain/use-cases/TaskService';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { TaskRepository } from './infrastructure/repositories/TaskRepository';
import { validateConfig } from './config/env.config';
import { swaggerSpec } from './config/swagger.config';

/**
 * Configuración de la aplicación Express
 * Siguiendo el principio de inversión de dependencias (Dependency Injection)
 */
export const createApp = (): Application => {
  const app = express();

  // Health check endpoint - debe ir PRIMERO
  app.get('/health', (_req, res) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    res.status(200).json({ 
      status: 'OK', 
      message: 'ATOM Todo API is running',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        api: '/api',
        docs: '/api-docs'
      }
    });
  });

  // Validar configuración DESPUÉS del health check
  try {
    validateConfig();
  } catch (error) {
    console.error(' Configuration validation failed:', error);
    // No fallar completamente, permitir que el health check funcione
  }

  // Middlewares globales
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware especial para rutas de documentación (sin CORS estricto)
  app.use(['/api-docs', '/api-docs.json'], (_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.use(corsMiddleware);

  // Swagger UI - Documentación interactiva
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'ATOM Todo API Documentation',
    explorer: true,
  }));

  // Swagger JSON
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Ruta de información de la API
  app.get('/', (_req, res) => {
    res.json({
      name: 'ATOM Todo API',
      version: '1.0.0',
      description: 'Backend API for ATOM Todo App',
      endpoints: {
        swagger: '/api-docs',
        swaggerJson: '/api-docs.json',
        health: '/health',
        api: '/api'
      }
    });
  });

  // Inyección de dependencias (Dependency Injection Pattern)
  // Repositorios
  const userRepository = new UserRepository();
  const taskRepository = new TaskRepository();

  // Servicios
  const userService = new UserService(userRepository);
  const taskService = new TaskService(taskRepository);

  // Controladores
  const userController = new UserController(userService);
  const taskController = new TaskController(taskService);

  // Rutas
  app.use('/api', createRoutes(userController, taskController));

  // Manejo de errores (debe ir al final)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
