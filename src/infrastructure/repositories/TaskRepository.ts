import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskFactory, TaskQueryParams, PaginatedTaskResponse } from '../../domain/entities/Task';
import { db } from '../../config/firebase.config';

/**
 * Implementación concreta del repositorio de tareas usando Firestore
 * Siguiendo el patrón Repository (DDD)
 */
export class TaskRepository implements ITaskRepository {
  private readonly collection = 'tasks';

  async findByUserId(userId: string): Promise<Task[]> {
    try {
      // Intentar consulta con orderBy (requiere índice compuesto)
      let snapshot;
      try {
        snapshot = await db
          .collection(this.collection)
          .where('userId', '==', userId)
          .where('active', '==', true)
          .orderBy('createdAt', 'desc')
          .get();
      } catch (orderError) {

        console.warn('OrderBy failed, trying without orderBy:', orderError);

        // Si falla el orderBy (falta de índice), hacer consulta simple
        snapshot = await db
          .collection(this.collection)
          .where('userId', '==', userId)
          .where('active', '==', true)
          .get();
      }

      if (snapshot.empty) {
        console.log('No active tasks found for user:', userId);
        return [];
      }

      const tasks = snapshot.docs.map(doc => this.mapDocumentToTask(doc));

      // Ordenar manualmente si no se pudo hacer en la consulta
      tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      console.log('Found', tasks.length, 'active tasks for user:', userId);
      return tasks;
    } catch (error) {
      console.error('Error finding tasks by user id:', error);
      throw new Error('Failed to find tasks by user id');
    }
  }

  async findWithQuery(params: TaskQueryParams): Promise<PaginatedTaskResponse> {
    try {
      console.log('Finding tasks with query params:', params);

      const page = params.page || 1;
      const limit = params.limit || 10;
      const sortBy = params.sortBy || 'createdAt';
      const sortOrder = params.sortOrder || 'desc';

      // Construir consulta base
      let query: FirebaseFirestore.Query = db.collection(this.collection);

      // Filtro por usuario (requerido)
      query = query.where('userId', '==', params.userId);

      // Filtro por estado activo (solo tareas activas)
      query = query.where('active', '==', true);

      // Filtro por estado de completado (opcional)
      if (params.completed !== undefined) {
        query = query.where('completed', '==', params.completed);
      }

      // Obtener todos los documentos primero (filtros de fecha y título se aplicarán en memoria)
      const snapshot = await query.get();

      if (snapshot.empty) {
        return {
          tasks: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }

      let tasks = snapshot.docs.map(doc => this.mapDocumentToTask(doc));

      // Filtro por rango de fechas (en memoria)
      if (params.startDate || params.endDate) {
        tasks = tasks.filter(task => {
          const taskDate = task.createdAt;
          if (params.startDate && taskDate < params.startDate) return false;
          if (params.endDate && taskDate > params.endDate) return false;
          return true;
        });
      }

      // Filtro por título (búsqueda parcial, en memoria)
      if (params.title) {
        const searchTerm = params.title.toLowerCase();
        tasks = tasks.filter(task => task.title.toLowerCase().includes(searchTerm));
      }

      // Ordenamiento
      tasks.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else if (sortBy === 'updatedAt') {
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        } else {
          // Por defecto: createdAt
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });

      // Paginación
      const total = tasks.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTasks = tasks.slice(startIndex, endIndex);

      console.log(`Found ${total} tasks, returning page ${page} of ${totalPages}`);

      return {
        tasks: paginatedTasks,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('Error finding tasks with query:', error);
      throw new Error('Failed to find tasks with query');
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const doc = await db.collection(this.collection).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return this.mapDocumentToTask(doc);
    } catch (error) {
      console.error('Error finding task by id:', error);
      throw new Error('Failed to find task by id');
    }
  }

  async create(dto: CreateTaskDTO): Promise<Task> {
    try {
      // Validar datos usando Factory
      const errors = TaskFactory.validate(dto);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }

      // Crear tarea usando Factory
      const taskData = TaskFactory.create(dto);

      // Guardar en Firestore
      const docRef = await db.collection(this.collection).add(taskData);

      // Retornar tarea creada con ID
      return {
        id: docRef.id,
        ...taskData,
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateTaskDTO): Promise<Task> {
    try {
      // Validar datos
      const errors = TaskFactory.validate(dto);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }

      // Obtener tarea actual
      const currentTask = await this.findById(id);
      if (!currentTask) {
        throw new Error('Task not found');
      }

      // Actualizar usando Factory
      const updatedTask = TaskFactory.update(currentTask, dto);

      // Guardar cambios en Firestore
      await db.collection(this.collection).doc(id).update({
        title: updatedTask.title,
        description: updatedTask.description,
        completed: updatedTask.completed,
        updatedAt: updatedTask.updatedAt,
      });

      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Verificar que la tarea existe y está activa
      const task = await this.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }

      // Borrado lógico: marcar como inactiva
      await db.collection(this.collection).doc(id).update({
        active: false,
        updatedAt: new Date(),
      });

      console.log('Task marked as inactive (soft delete):', id);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const task = await this.findById(id);
      return task !== null && task.active;
    } catch (error) {
      console.error('Error checking if task exists:', error);
      return false;
    }
  }

  /**
   * Mapea un documento de Firestore a una entidad Task
   */
  private mapDocumentToTask(doc: FirebaseFirestore.DocumentSnapshot): Task {
    const data = doc.data();

    if (!data) {
      console.error('❌ Invalid document data for doc:', doc.id);
      throw new Error('Invalid document data');
    }

    try {
      return {
        id: doc.id,
        userId: data.userId || '',
        title: data.title || '',
        description: data.description || '',
        completed: data.completed || false,
        active: data.active !== undefined ? data.active : true, // Por defecto true para tareas antiguas
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('❌ Error mapping document to task:', error, 'Data:', data);
      throw new Error(`Failed to map document ${doc.id} to task`);
    }
  }
}
