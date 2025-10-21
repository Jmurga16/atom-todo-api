import { Request, Response } from 'express';
import { TaskService } from '../../domain/use-cases/TaskService';
import { asyncHandler, AppError } from '../middlewares/error.middleware';

/**
 * Controlador de tareas
 * Maneja las peticiones HTTP relacionadas con tareas
 * Siguiendo el patrón MVC
 */
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * GET /api/tasks/user/:userId
   * Obtiene todas las tareas de un usuario
   * Implementa el requisito: "Obtener la lista de todas las tareas"
   */
  getTasksByUserId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    const tasks = await this.taskService.getTasksByUserId(userId);

    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  });

  /**
   * GET /api/tasks/:id
   * Obtiene una tarea por su ID
   */
  getTaskById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const task = await this.taskService.getTaskById(id);

    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  });

  /**
   * POST /api/tasks
   * Crea una nueva tarea
   * Implementa el requisito: "Agregar una nueva tarea"
   */
  createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, title, description } = req.body;

    const task = await this.taskService.createTask({
      userId,
      title,
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  });

  /**
   * PUT /api/tasks/:id
   * Actualiza una tarea existente
   * Implementa el requisito: "Actualizar los datos de una tarea existente"
   */
  updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const task = await this.taskService.updateTask(id, {
      title,
      description,
      completed,
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  });

  /**
   * PATCH /api/tasks/:id/toggle
   * Alterna el estado de completado de una tarea
   */
  toggleTaskCompletion = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const task = await this.taskService.toggleTaskCompletion(id);

    res.status(200).json({
      success: true,
      message: 'Task status toggled successfully',
      data: task,
    });
  });

  /**
   * DELETE /api/tasks/:id
   * Elimina una tarea
   * Implementa el requisito: "Eliminar una tarea existente"
   */
  deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await this.taskService.deleteTask(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  });
}
