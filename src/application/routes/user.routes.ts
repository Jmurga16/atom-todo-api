import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { createUserValidator, validate } from '../validators/user.validator';

/**
 * Factory para crear las rutas de usuarios
 * Siguiendo el patrón Factory
 */
export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  /**
   * @route   GET /api/users/:email
   * @desc    Buscar usuario por email
   * @access  Public
   */
  router.get('/:email', userController.getUserByEmail);

  /**
   * @route   POST /api/users
   * @desc    Crear nuevo usuario
   * @access  Public
   */
  router.post('/', createUserValidator, validate, userController.createUser);

  /**
   * @route   POST /api/users/check
   * @desc    Verificar si un usuario existe
   * @access  Public
   */
  router.post('/check', createUserValidator, validate, userController.checkUserExists);

  return router;
};
