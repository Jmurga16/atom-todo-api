import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../domain/use-cases/JwtService';
import { AppError } from './error.middleware';

/**
 * Extensión del Request para incluir datos del usuario autenticado
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

/**
 * Middleware de autenticación JWT
 * Verifica que el token JWT sea válido y extrae los datos del usuario
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(401, 'No authorization token provided');
    }

    // Verificar formato: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AppError(401, 'Invalid token format. Expected: Bearer <token>');
    }

    const token = parts[1];

    // Verificar y decodificar el token
    const jwtService = new JwtService();
    const decoded = jwtService.verifyToken(token);

    // Agregar datos del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message === 'Token expired') {
        throw new AppError(401, 'Token expired. Please login again.');
      }
      if (error.message === 'Invalid token') {
        throw new AppError(401, 'Invalid authentication token');
      }
    }

    throw new AppError(401, 'Authentication failed');
  }
};

/**
 * Middleware opcional de autenticación
 * Si hay token, lo valida y agrega el usuario al request
 * Si no hay token, continúa sin error
 */
export const optionalAuthMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // No hay token, pero no es error
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1];
      const jwtService = new JwtService();
      const decoded = jwtService.verifyToken(token);

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
    }

    next();
  } catch {
    // Token inválido, pero no bloqueamos el request
    next();
  }
};
