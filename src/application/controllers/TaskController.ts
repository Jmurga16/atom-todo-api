import { Request, Response } from 'express';
import { TaskService } from '../../domain/use-cases/TaskService';
import { asyncHandler, AppError } from '../middlewares/error.middleware';
import { ApiResponse } from '../../domain/entities/ApiResponse';
import { Task, PaginatedTaskResponse } from '../../domain/entities/Task';


export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /** GET /api/tasks
   * Obtiene todas las tareas activas del usuario autenticado
   */
  getAllTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'User not authenticated');
    }

    const tasks = await this.taskService.getTasksByUserId(req.user.userId);

    const response: ApiResponse<Task[]> = {
      success: true,
      data: tasks,
    };

    res.status(200).json(response);
  });

  /** GET /api/tasks/query
   * Obtiene tareas con paginación, ordenamiento y filtros
   */
  getTasksWithQuery = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'User not authenticated');
    }

    const {
      page,
      limit,
      sortBy,
      sortOrder,
      completed,
      title,
      startDate,
      endDate,
    } = req.query;

    const queryParams = {
      userId: req.user.userId,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as 'createdAt' | 'updatedAt' | 'title' | undefined,
      sortOrder: sortOrder as 'asc' | 'desc' | undefined,
      completed: completed !== undefined ? completed === 'true' : undefined,
      title: title as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    };

    const result = await this.taskService.getTasksWithQuery(queryParams);

    const response: ApiResponse<PaginatedTaskResponse> = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  });

  /** GET /api/tasks/:id
   * Obtiene una tarea por su ID
   */
  getTaskById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'User not authenticated');
    }

    const { id } = req.params;
    const task = await this.taskService.getTaskById(id);

    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    // Verificar que la tarea pertenece al usuario autenticado
    if (task.userId !== req.user.userId) {
      throw new AppError(403, 'Access denied to this task');
    }

    const response: ApiResponse<Task> = {
      success: true,
      data: task,
    };

    res.status(200).json(response);
  });

  /** POST /api/tasks
   * Crea una nueva tarea
   */
  createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'User not authenticated');
    }

    const { title, description } = req.body;

    const task = await this.taskService.createTask({
      userId: req.user.userId, // Usar userId del token
      title,
      description: description || '',
    });

    const response: ApiResponse<Task> = {
      success: true,
      message: 'Task created successfully',
      data: task,
    };

    res.status(201).json(response);
  });

  /** PUT /api/tasks/:id
   * Actualiza una tarea existente
   */
  updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'User not authenticated');
    }

    const { id } = req.params;
    const { title, description, completed } = req.body;

    // Verificar que la tarea existe y pertenece al usuario
    const existingTask = await this.taskService.getTaskById(id);
    if (!existingTask) {
      throw new AppError(404, 'Task not found');
    }
    if (existingTask.userId !== req.user.userId) {
      throw new AppError(403, 'Access denied to this task');
    }

    const task = await this.taskService.updateTask(id, {
      title,
      description,
      completed,
    });

    const response: ApiResponse<Task> = {
      success: true,
      message: 'Task updated successfully',
      data: task,
    };

    res.status(200).json(response);
  });

  /** PATCH /api/tasks/:id/toggle
   * Alterna el estado de completado de una tarea
   */
  toggleTaskCompletion = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'User not authenticated');
    }

    const { id } = req.params;

    // Verificar que la tarea existe y pertenece al usuario
    const existingTask = await this.taskService.getTaskById(id);
    if (!existingTask) {
      throw new AppError(404, 'Task not found');
    }
    if (existingTask.userId !== req.user.userId) {
      throw new AppError(403, 'Access denied to this task');
    }

    const task = await this.taskService.toggleTaskCompletion(id);

    const response: ApiResponse<Task> = {
      success: true,
      message: 'Task status toggled successfully',
      data: task,
    };

    res.status(200).json(response);
  });

  /** DELETE /api/tasks/:id
   * Elimina una tarea (borrado lógico)
   */
  deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(401, 'User not authenticated');
    }

    const { id } = req.params;

    // Verificar que la tarea existe y pertenece al usuario
    const existingTask = await this.taskService.getTaskById(id);
    if (!existingTask) {
      throw new AppError(404, 'Task not found');
    }
    if (existingTask.userId !== req.user.userId) {
      throw new AppError(403, 'Access denied to this task');
    }

    await this.taskService.deleteTask(id);

    const response: ApiResponse = {
      success: true,
      message: 'Task deleted successfully',
    };

    res.status(200).json(response);
  });
}
