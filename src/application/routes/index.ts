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

  /**
   * @swagger
   * /api/health:
   *   get:
   *     tags: [Health]
   *     summary: Health check
   *     description: Check if the API is running and responsive
   *     responses:
   *       200:
   *         description: API is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: API is running
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: 2024-01-15T10:00:00.000Z
   */
  router.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
};
