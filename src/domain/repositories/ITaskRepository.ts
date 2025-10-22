import { Task, CreateTaskDTO, UpdateTaskDTO, TaskQueryParams, PaginatedTaskResponse } from '../entities/Task';

/**
 * Interface del repositorio de tareas
 * Siguiendo el principio de inversión de dependencias (SOLID)
 * La capa de dominio define el contrato, la infraestructura lo implementa
 */
export interface ITaskRepository {
  /**
   * Obtiene todas las tareas activas de un usuario ordenadas por fecha de creación
   */
  findByUserId(userId: string): Promise<Task[]>;

  /**
   * Obtiene tareas con paginación, ordenamiento y filtros
   */
  findWithQuery(params: TaskQueryParams): Promise<PaginatedTaskResponse>;

  /**
   * Busca una tarea por su ID
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Crea una nueva tarea
   */
  create(dto: CreateTaskDTO): Promise<Task>;

  /**
   * Actualiza una tarea existente
   */
  update(id: string, dto: UpdateTaskDTO): Promise<Task>;

  /**
   * Elimina una tarea (borrado lógico - marca como inactiva)
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica si una tarea existe y está activa
   */
  exists(id: string): Promise<boolean>;
}
