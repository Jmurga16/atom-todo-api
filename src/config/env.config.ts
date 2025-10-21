import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración centralizada de variables de entorno
 * Siguiendo el principio de responsabilidad única (SOLID)
 */
export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'],
  },
} as const;

/**
 * Valida que las variables de entorno requeridas estén configuradas
 */
export function validateConfig(): void {
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0 && config.nodeEnv !== 'production') {
    console.warn(`Warning: Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('The app may not work correctly. Please check your .env file.');
  }
}
