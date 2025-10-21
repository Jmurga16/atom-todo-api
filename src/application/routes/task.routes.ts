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
   * @swagger
   * /api/tasks/user/{userId}:
   *   get:
   *     tags: [Tasks]
   *     summary: Get all tasks for a user
   *     description: Retrieve all tasks belonging to a specific user, ordered by creation date (newest first)
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *         example: user123
   *     responses:
   *       200:
   *         description: List of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Task'
   *                 count:
   *                   type: number
   *                   example: 5
   */
  router.get(
    '/user/:userId',
    getTasksByUserValidator,
    validate,
    taskController.getTasksByUserId
  );

  /**
   * @swagger
   * /api/tasks/{id}:
   *   get:
   *     tags: [Tasks]
   *     summary: Get task by ID
   *     description: Retrieve a specific task by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *         example: task123
   *     responses:
   *       200:
   *         description: Task found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   */
  router.get('/:id', taskIdValidator, validate, taskController.getTaskById);

  /**
   * @swagger
   * /api/tasks:
   *   post:
   *     tags: [Tasks]
   *     summary: Create a new task
   *     description: Create a new task for a user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTaskRequest'
   *     responses:
   *       201:
   *         description: Task created successfully
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
   *                   example: Task created successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         description: Invalid input
   */
  router.post('/', createTaskValidator, validate, taskController.createTask);

  /**
   * @swagger
   * /api/tasks/{id}:
   *   put:
   *     tags: [Tasks]
   *     summary: Update a task
   *     description: Update an existing task (title, description, or completion status)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *         example: task123
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTaskRequest'
   *     responses:
   *       200:
   *         description: Task updated successfully
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
   *                   example: Task updated successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   */
  router.put('/:id', updateTaskValidator, validate, taskController.updateTask);

  /**
   * @swagger
   * /api/tasks/{id}/toggle:
   *   patch:
   *     tags: [Tasks]
   *     summary: Toggle task completion status
   *     description: Switch task between completed and pending status
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *         example: task123
   *     responses:
   *       200:
   *         description: Task status toggled successfully
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
   *                   example: Task status toggled successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   */
  router.patch('/:id/toggle', taskIdValidator, validate, taskController.toggleTaskCompletion);

  /**
   * @swagger
   * /api/tasks/{id}:
   *   delete:
   *     tags: [Tasks]
   *     summary: Delete a task
   *     description: Permanently delete a task
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *         example: task123
   *     responses:
   *       200:
   *         description: Task deleted successfully
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
   *                   example: Task deleted successfully
   *       404:
   *         description: Task not found
   */
  router.delete('/:id', taskIdValidator, validate, taskController.deleteTask);

  return router;
};
