import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { createUserValidator, validate } from '../validators/user.validator';


// Rutas para la gestión de usuarios "api/users"

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  /**
   * @swagger
   * /api/users/login:
   *   post:
   *     tags: [Users]
   *     summary: Login user by email
   *     description: |
   *       Search for a user by their email address and return user data with JWT token if exists.
   *       If user doesn't exist, returns exists: false without error (200 OK for security).
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *     responses:
   *       200:
   *         description: Response successful (user may or may not exist)
   *         content:
   *           application/json:
   *             schema:
   *               oneOf:
   *                 - type: object
   *                   description: User exists
   *                   properties:
   *                     success:
   *                       type: boolean
   *                       example: true
   *                     exists:
   *                       type: boolean
   *                       example: true
   *                     data:
   *                       $ref: '#/components/schemas/User'
   *                     token:
   *                       type: string
   *                       description: JWT authentication token
   *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *                 - type: object
   *                   description: User does not exist
   *                   properties:
   *                     success:
   *                       type: boolean
   *                       example: true
   *                     exists:
   *                       type: boolean
   *                       example: false
   *                     message:
   *                       type: string
   *                       example: User not found
   *       400:
   *         description: Invalid email format
   */
  router.post('/login', createUserValidator, validate, userController.login);

  /**
   * @swagger
   * /api/users/get-by-email:
   *   post:
   *     tags: [Users]
   *     summary: Get user data by email
   *     description: |
   *       Search for a user by their email address and return user data WITHOUT JWT token.
   *       Use /login if you need authentication token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *     responses:
   *       200:
   *         description: Response successful
   *         content:
   *           application/json:
   *             schema:
   *               oneOf:
   *                 - type: object
   *                   description: User exists
   *                   properties:
   *                     success:
   *                       type: boolean
   *                       example: true
   *                     exists:
   *                       type: boolean
   *                       example: true
   *                     data:
   *                       $ref: '#/components/schemas/User'
   *                 - type: object
   *                   description: User does not exist
   *                   properties:
   *                     success:
   *                       type: boolean
   *                       example: true
   *                     exists:
   *                       type: boolean
   *                       example: false
   *                     message:
   *                       type: string
   *                       example: User not found
   *       400:
   *         description: Invalid email format
   */
  router.post('/get-by-email', createUserValidator, validate, userController.getUserByEmail);

  /**
   * @swagger
   * /api/users:
   *   post:
   *     tags: [Users]
   *     summary: Create a new user
   *     description: Register a new user with their email address and return JWT token
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
   *                 token:
   *                   type: string
   *                   description: JWT authentication token
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
