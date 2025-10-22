import { Request, Response } from 'express';
import { UserService } from '../../domain/use-cases/UserService';
import { JwtService } from '../../domain/use-cases/JwtService';
import { asyncHandler, AppError } from '../middlewares/error.middleware';


export class UserController {
  private readonly jwtService: JwtService;

  constructor(private readonly userService: UserService) {
    this.jwtService = new JwtService();
  }

  /** POST /api/users/login
   * Busca un usuario por email y retorna sus datos con JWT token si existe
   * Si no existe, retorna exists: false sin error 404 (mejor seguridad)
   */
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      // Usuario no existe, pero NO es un error (200 OK)
      res.status(200).json({
        success: true,
        exists: false,
        message: 'User not found',
      });
      return;
    }

    // Generar JWT token
    const token = this.jwtService.generateToken(user.id, user.email);

    res.status(200).json({
      success: true,
      exists: true,
      token,
    });
  });

  /** POST /api/users/login
   * Busca un usuario por email
  */
  getUserByEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      // Usuario no existe, pero NO es un error (200 OK)
      res.status(200).json({
        success: true,
        exists: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      exists: true,
      data: user
    });
  });

  /** POST /api/users
   * Crea un nuevo usuario y retorna JWT token
   */
  createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
      const user = await this.userService.createUser({ email });

      // Generar JWT token para el nuevo usuario
      const token = this.jwtService.generateToken(user.id, user.email);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
        token,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        throw new AppError(409, 'User already exists');
      }
      throw error;
    }
  });

  /** POST /api/users/check
   * Verifica si un usuario existe por email
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
