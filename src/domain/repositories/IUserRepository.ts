import { User, CreateUserDTO } from '../entities/User';

/**
 * Interface del repositorio de usuarios
 * Siguiendo el principio de inversión de dependencias (SOLID)
 * La capa de dominio define el contrato, la infraestructura lo implementa
 */
export interface IUserRepository {
  /**
   * Busca un usuario por su email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca un usuario por su ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Crea un nuevo usuario
   */
  create(dto: CreateUserDTO): Promise<User>;

  /**
   * Verifica si un usuario existe por email
   */
  exists(email: string): Promise<boolean>;
}
