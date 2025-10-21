import { Request, Response } from 'express';
import { UserService } from '../../domain/use-cases/UserService';
import { asyncHandler, AppError } from '../middlewares/error.middleware';

/**
 * Controlador de usuarios
 * Maneja las peticiones HTTP relacionadas con usuarios
 * Siguiendo el patrón MVC
 */
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * GET /api/users/:email
   * Busca un usuario por email
   * Implementa el requisito: "Busca el usuario si ha sido creado"
   */
  getUserByEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        userExists: false,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
      userExists: true,
    });
  });

  /**
   * POST /api/users
   * Crea un nuevo usuario
   * Implementa el requisito: "Agrega un nuevo usuario"
   */
  createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
      const user = await this.userService.createUser({ email });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        throw new AppError(409, 'User already exists');
      }
      throw error;
    }
  });

  /**
   * POST /api/users/check
   * Verifica si un usuario existe por email
   * Endpoint auxiliar para el flujo de login
   */
  checkUserExists = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const exists = await this.userService.exists(email);

    res.status(200).json({
      success: true,
      exists,
      ...(exists && { message: 'User exists' }),
      ...(!exists && { message: 'User not found' }),
    });
  });
}
