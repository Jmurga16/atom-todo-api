import { ITaskRepository } from '../repositories/ITaskRepository';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskQueryParams, PaginatedTaskResponse } from '../entities/Task';

/**
 * Servicio de tareas - Casos de uso
 * Contiene la lógica de negocio relacionada con tareas
 * Siguiendo el principio de inversión de dependencias (SOLID)
 */
export class TaskService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  /**
   * Obtiene todas las tareas activas de un usuario ordenadas por fecha de creación
   * Implementa el requisito: "todas las tareas pendientes del usuario ordenadas por fecha de creación"
   */
  async getTasksByUserId(userId: string): Promise<Task[]> {
    try {
      return await this.taskRepository.findByUserId(userId);
    } catch (error) {
      console.error('Error getting tasks by user id:', error);
      throw new Error('Failed to get tasks');
    }
  }

  /**
   * Obtiene tareas con paginación, ordenamiento y filtros
   * Implementa el requisito: "Obtener tareas (paginado y ordenamiento con filtros)"
   */
  async getTasksWithQuery(params: TaskQueryParams): Promise<PaginatedTaskResponse> {
    try {
      return await this.taskRepository.findWithQuery(params);
    } catch (error) {
      console.error('Error getting tasks with query:', error);
      throw new Error('Failed to get tasks with query');
    }
  }

  /**
   * Obtiene una tarea por su ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    try {
      return await this.taskRepository.findById(id);
    } catch (error) {
      console.error('Error getting task by id:', error);
      throw new Error('Failed to get task');
    }
  }

  /**
   * Crea una nueva tarea
   * Implementa el requisito: "permite agregar nuevas tareas"
   */
  async createTask(dto: CreateTaskDTO): Promise<Task> {
    try {
      return await this.taskRepository.create(dto);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Actualiza una tarea existente
   * Implementa los requisitos:
   * - "editar una tarea"
   * - "marcar una tarea como completada o pendiente"
   */
  async updateTask(id: string, dto: UpdateTaskDTO): Promise<Task> {
    try {
      return await this.taskRepository.update(id, dto);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  /**
   * Marca una tarea como completada o pendiente
   */
  async toggleTaskCompletion(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findById(id);

      if (!task) {
        throw new Error('Task not found');
      }

      return await this.taskRepository.update(id, {
        completed: !task.completed,
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }

  /**
   * Elimina una tarea
   * Implementa el requisito: "eliminar una tarea"
   */
  async deleteTask(id: string): Promise<void> {
    try {
      await this.taskRepository.delete(id);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Verifica si una tarea existe
   */
  async taskExists(id: string): Promise<boolean> {
    try {
      return await this.taskRepository.exists(id);
    } catch (error) {
      console.error('Error checking if task exists:', error);
      return false;
    }
  }
}
