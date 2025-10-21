import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validadores para las rutas de usuarios
 * Siguiendo el principio DRY (Don't Repeat Yourself)
 */

export const createUserValidator = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .trim(),
];

export const getUserByEmailValidator = [
  param('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .trim(),
];

/**
 * Middleware para verificar los resultados de la validación
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
      })),
    });
    return;
  }

  next();
};
