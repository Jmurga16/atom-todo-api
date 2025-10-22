import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { createTaskValidator, updateTaskValidator, taskIdValidator, } from '../validators/task.validator';
import { validate } from '../validators/user.validator';
import { authMiddleware } from '../middlewares/auth.middleware';


export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();

  // Aplicar auth middleware a todas las rutas de tareas
  router.use(authMiddleware);

  /**
   * @swagger
   * /api/tasks:
   *   get:
   *     tags: [Tasks]
   *     summary: Get all active tasks for authenticated user
   *     description: Retrieve all active tasks belonging to the authenticated user, ordered by creation date (newest first)
   *     security:
   *       - BearerAuth: []
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
   *       401:
   *         description: Unauthorized
   */
  router.get('/', taskController.getAllTasks);

  /**
   * @swagger
   * /api/tasks/query:
   *   get:
   *     tags: [Tasks]
   *     summary: Get tasks with pagination, sorting and filters
   *     description: Retrieve tasks with optional filters, pagination and sorting
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number (default 1)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Items per page (default 10)
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [createdAt, updatedAt, title]
   *         description: Field to sort by (default createdAt)
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *         description: Sort order (default desc)
   *       - in: query
   *         name: completed
   *         schema:
   *           type: boolean
   *         description: Filter by completion status
   *       - in: query
   *         name: title
   *         schema:
   *           type: string
   *         description: Search by title (partial match)
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Filter tasks created after this date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Filter tasks created before this date
   *     responses:
   *       200:
   *         description: Paginated list of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     tasks:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Task'
   *                     total:
   *                       type: number
   *                     page:
   *                       type: number
   *                     limit:
   *                       type: number
   *                     totalPages:
   *                       type: number
   *       401:
   *         description: Unauthorized
   */
  router.get('/query', taskController.getTasksWithQuery);

  /**
   * @swagger
   * /api/tasks/{id}:
   *   get:
   *     tags: [Tasks]
   *     summary: Get task by ID
   *     description: Retrieve a specific task by its ID (must belong to authenticated user)
   *     security:
   *       - BearerAuth: []
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
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Access denied
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
   *     description: Create a new task for the authenticated user
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *                 example: Complete project documentation
   *               description:
   *                 type: string
   *                 example: Write comprehensive documentation for the API
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
   *       401:
   *         description: Unauthorized
   */
  router.post('/', createTaskValidator, validate, taskController.createTask);

  /**
   * @swagger
   * /api/tasks/{id}:
   *   put:
   *     tags: [Tasks]
   *     summary: Update a task
   *     description: Update an existing task (title, description, or completion status) - must belong to authenticated user
   *     security:
   *       - BearerAuth: []
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
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 example: Updated task title
   *               description:
   *                 type: string
   *                 example: Updated task description
   *               completed:
   *                 type: boolean
   *                 example: true
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
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Access denied
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
   *     description: Switch task between completed and pending status - must belong to authenticated user
   *     security:
   *       - BearerAuth: []
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
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Access denied
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
   *     description: Soft delete a task (marks as inactive) - must belong to authenticated user
   *     security:
   *       - BearerAuth: []
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
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Access denied
   *       404:
   *         description: Task not found
   */
  router.delete('/:id', taskIdValidator, validate, taskController.deleteTask);

  return router;
};
