import { IUserRepository } from '../repositories/IUserRepository';
import { User, CreateUserDTO } from '../entities/User';

/**
 * Servicio de usuarios - Casos de uso
 * Contiene la lógica de negocio relacionada con usuarios
 * Siguiendo el principio de inversión de dependencias (SOLID)
 */
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Busca un usuario por email o lo crea si no existe
   * Este método implementa la lógica del requisito:
   * "Si el usuario existe, navega a la página principal,
   * en caso contrario se deberá presentar un diálogo que confirme la creación del usuario"
   */
  async findOrCreate(email: string): Promise<{ user: User; isNew: boolean }> {
    try {
      // Buscar usuario existente
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        return {
          user: existingUser,
          isNew: false,
        };
      }

      // Si no existe, retornar indicador para confirmar creación
      // La creación real se hará con createUser() después de la confirmación
      throw new Error('USER_NOT_FOUND');
    } catch (error) {
      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        throw error;
      }
      console.error('Error in findOrCreate:', error);
      throw new Error('Failed to process user request');
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async createUser(dto: CreateUserDTO): Promise<User> {
    try {
      return await this.userRepository.create(dto);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Busca un usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Busca un usuario por ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  /**
   * Verifica si un usuario existe
   */
  async exists(email: string): Promise<boolean> {
    try {
      return await this.userRepository.exists(email);
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }
}
