export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  userId: string;
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskQueryParams {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  completed?: boolean;
  title?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginatedTaskResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class TaskFactory {
  static create(dto: CreateTaskDTO): Omit<Task, 'id'> {
    const now = new Date();

    return {
      userId: dto.userId,
      title: dto.title.trim(),
      description: dto.description.trim(),
      completed: false,
      active: true,
      createdAt: now,
      updatedAt: now,
    };
  }

  static update(currentTask: Task, dto: UpdateTaskDTO): Task {
    return {
      ...currentTask,
      title: dto.title !== undefined ? dto.title.trim() : currentTask.title,
      description: dto.description !== undefined ? dto.description.trim() : currentTask.description,
      completed: dto.completed !== undefined ? dto.completed : currentTask.completed,
      updatedAt: new Date(),
    };
  }

  static validate(dto: CreateTaskDTO | UpdateTaskDTO): string[] {
    const errors: string[] = [];

    if ('title' in dto && dto.title !== undefined) {
      if (!dto.title || dto.title.trim().length === 0) {
        errors.push('Title is required');
      } else if (dto.title.trim().length > 100) {
        errors.push('Title must be less than 100 characters');
      }
    }

    if ('description' in dto && dto.description !== undefined) {
      if (dto.description.trim().length > 500) {
        errors.push('Description must be less than 500 characters');
      }
    }

    return errors;
  }
}
