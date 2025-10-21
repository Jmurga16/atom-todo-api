import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import {
  createTaskValidator,
  updateTaskValidator,
  getTasksByUserValidator,
  taskIdValidator,
} from '../validators/task.validator';
import { validate } from '../validators/user.validator';

/**
 * Factory para crear las rutas de tareas
 * Siguiendo el patrón Factory
 */
export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();

  /**
   * @route   GET /api/tasks/user/:userId
   * @desc    Obtener todas las tareas de un usuario
   * @access  Public
   */
  router.get(
    '/user/:userId',
    getTasksByUserValidator,
    validate,
    taskController.getTasksByUserId
  );

  /**
   * @route   GET /api/tasks/:id
   * @desc    Obtener tarea por ID
   * @access  Public
   */
  router.get('/:id', taskIdValidator, validate, taskController.getTaskById);

  /**
   * @route   POST /api/tasks
   * @desc    Crear nueva tarea
   * @access  Public
   */
  router.post('/', createTaskValidator, validate, taskController.createTask);

  /**
   * @route   PUT /api/tasks/:id
   * @desc    Actualizar tarea
   * @access  Public
   */
  router.put('/:id', updateTaskValidator, validate, taskController.updateTask);

  /**
   * @route   PATCH /api/tasks/:id/toggle
   * @desc    Alternar estado de completado
   * @access  Public
   */
  router.patch('/:id/toggle', taskIdValidator, validate, taskController.toggleTaskCompletion);

  /**
   * @route   DELETE /api/tasks/:id
   * @desc    Eliminar tarea
   * @access  Public
   */
  router.delete('/:id', taskIdValidator, validate, taskController.deleteTask);

  return router;
};
