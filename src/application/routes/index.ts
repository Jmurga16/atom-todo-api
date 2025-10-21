import { Router } from 'express';
import { createUserRoutes } from './user.routes';
import { createTaskRoutes } from './task.routes';
import { UserController } from '../controllers/UserController';
import { TaskController } from '../controllers/TaskController';

/**
 * Factory para crear todas las rutas de la aplicación
 * Centraliza la configuración de rutas
 */
export const createRoutes = (
  userController: UserController,
  taskController: TaskController
): Router => {
  const router = Router();

  // Rutas de usuarios
  router.use('/users', createUserRoutes(userController));

  // Rutas de tareas
  router.use('/tasks', createTaskRoutes(taskController));

  // Ruta de health check
  router.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
};
