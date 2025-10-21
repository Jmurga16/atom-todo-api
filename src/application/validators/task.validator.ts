import { body, param } from 'express-validator';

/**
 * Validadores para las rutas de tareas
 * Siguiendo el principio DRY (Don't Repeat Yourself)
 */

export const createTaskValidator = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string')
    .trim(),

  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
];

export const updateTaskValidator = [
  param('id')
    .notEmpty()
    .withMessage('Task ID is required')
    .isString()
    .withMessage('Task ID must be a string'),

  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),

  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),
];

export const getTasksByUserValidator = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string')
    .trim(),
];

export const taskIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Task ID is required')
    .isString()
    .withMessage('Task ID must be a string'),
];
