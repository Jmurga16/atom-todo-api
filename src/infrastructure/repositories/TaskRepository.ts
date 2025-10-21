import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskFactory } from '../../domain/entities/Task';
import { db } from '../../config/firebase.config';

/**
 * Implementación concreta del repositorio de tareas usando Firestore
 * Siguiendo el patrón Repository (DDD)
 */
export class TaskRepository implements ITaskRepository {
  private readonly collection = 'tasks';

  async findByUserId(userId: string): Promise<Task[]> {
    try {
      console.log('🔍 Finding tasks for user:', userId);
      
      // Intentar consulta con orderBy (requiere índice compuesto)
      let snapshot;
      try {
        snapshot = await db
          .collection(this.collection)
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .get();
      } catch (orderError) {
        console.warn('⚠️  OrderBy failed, trying without orderBy:', orderError);
        // Si falla el orderBy (falta de índice), hacer consulta simple
        snapshot = await db
          .collection(this.collection)
          .where('userId', '==', userId)
          .get();
      }

      if (snapshot.empty) {
        console.log('📭 No tasks found for user:', userId);
        return [];
      }

      const tasks = snapshot.docs.map(doc => this.mapDocumentToTask(doc));
      
      // Ordenar manualmente si no se pudo hacer en la consulta
      tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      console.log('✅ Found', tasks.length, 'tasks for user:', userId);
      return tasks;
    } catch (error) {
      console.error('❌ Error finding tasks by user id:', error);
      throw new Error('Failed to find tasks by user id');
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
      // Verificar que la tarea existe
      const task = await this.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }

      // Eliminar de Firestore
      await db.collection(this.collection).doc(id).delete();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const task = await this.findById(id);
      return task !== null;
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
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('❌ Error mapping document to task:', error, 'Data:', data);
      throw new Error(`Failed to map document ${doc.id} to task`);
    }
  }
}
