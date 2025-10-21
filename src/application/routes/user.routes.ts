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
   * @swagger
   * /api/users/{email}:
   *   get:
   *     tags: [Users]
   *     summary: Get user by email
   *     description: Search for a user by their email address
   *     parameters:
   *       - in: path
   *         name: email
   *         required: true
   *         schema:
   *           type: string
   *           format: email
   *         description: User email address
   *         example: user@example.com
   *     responses:
   *       200:
   *         description: User found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *                 userExists:
   *                   type: boolean
   *                   example: true
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get('/:email', userController.getUserByEmail);

  /**
   * @swagger
   * /api/users:
   *   post:
   *     tags: [Users]
   *     summary: Create a new user
   *     description: Register a new user with their email address
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserRequest'
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: User created successfully
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Invalid input
   *       409:
   *         description: User already exists
   */
  router.post('/', createUserValidator, validate, userController.createUser);

  /**
   * @swagger
   * /api/users/check:
   *   post:
   *     tags: [Users]
   *     summary: Check if user exists
   *     description: Verify if a user with the given email exists
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserRequest'
   *     responses:
   *       200:
   *         description: Check completed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 exists:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   */
  router.post('/check', createUserValidator, validate, userController.checkUserExists);

  return router;
};
