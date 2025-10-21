import express, { Application } from 'express';
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

/**
 * Configuración de la aplicación Express
 * Siguiendo el principio de inversión de dependencias (Dependency Injection)
 */
export const createApp = (): Application => {
  // Validar configuración
  validateConfig();

  const app = express();

  // Middlewares globales
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(corsMiddleware);

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
