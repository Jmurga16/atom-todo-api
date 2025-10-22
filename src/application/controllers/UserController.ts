import { Request, Response } from 'express';
import { UserService } from '../../domain/use-cases/UserService';
import { JwtService } from '../../domain/use-cases/JwtService';
import { asyncHandler, AppError } from '../middlewares/error.middleware';
import { UserWithToken, UserExistsData } from '../../domain/entities/User';
import { ApiResponse } from '../../domain/entities/ApiResponse';


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
      // Usuario no existe
      const response: ApiResponse<UserExistsData> = {
        success: true,
        data: { exists: false },
        message: 'User not found',
      };
      res.status(200).json(response);
      return;
    }

    // Generar JWT token
    const token = this.jwtService.generateToken(user.id, user.email);

    const response: ApiResponse<UserExistsData> = {
      success: true,
      data: {
        exists: true,
        token,
      },
    };
    res.status(200).json(response);
  });

  /** POST /api/users/login
   * Busca un usuario por email
  */
  getUserByEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      // Usuario no existe
      const response: ApiResponse<UserExistsData> = {
        success: true,
        data: { exists: false },
        message: 'User not found',
      };
      res.status(200).json(response);
      return;
    }

    const response: ApiResponse<UserExistsData> = {
      success: true,
      data: {
        exists: true,
        user,
      },
    };
    res.status(200).json(response);
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

      const userWithToken: UserWithToken = { ...user, token };

      const response: ApiResponse<UserWithToken> = {
        success: true,
        message: 'User created successfully',
        data: userWithToken,
      };
      res.status(201).json(response);
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

    const response: ApiResponse<{ exists: boolean }> = {
      success: true,
      data: { exists },
      message: exists ? 'User exists' : 'User not found',
    };
    res.status(200).json(response);
  });
}
