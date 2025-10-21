/**
 * User Entity - Representa un usuario en el dominio
 * Siguiendo principios de DDD (Domain-Driven Design)
 */
export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear un nuevo usuario
 */
export interface CreateUserDTO {
  email: string;
}

/**
 * Factory pattern para crear usuarios
 */
export class UserFactory {
  static create(email: string): Omit<User, 'id'> {
    const now = new Date();

    return {
      email: email.toLowerCase().trim(),
      createdAt: now,
      updatedAt: now,
    };
  }

  static validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
