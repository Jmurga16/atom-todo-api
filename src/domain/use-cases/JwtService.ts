import jwt from 'jsonwebtoken';
import { config } from '../../config/env.config';

/**
 * Payload del JWT Token
 */
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;  // issued at
  exp?: number;  // expiration
}

/**
 * Servicio para manejar JWT tokens
 * Siguiendo el principio de responsabilidad única (SOLID)
 */
export class JwtService {
  /**
   * Genera un JWT token para un usuario
   */
  generateToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      userId,
      email,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as any);
  }

  /**
   * Verifica y decodifica un JWT token
   */
  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Decodifica un token sin verificarlo (útil para debugging)
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }
}
