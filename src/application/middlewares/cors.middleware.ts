import cors from 'cors';
import { config } from '../../config/env.config';

/**
 * Configuración de CORS
 * Implementa el requisito de seguridad: "Configuración de CORS"
 */
export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    console.log('CORS Request from origin:', origin);
    console.log('Allowed origins:', config.cors.allowedOrigins);

    // Permitir requests sin origin (como mobile apps, curl, o Swagger UI)
    if (!origin) {
      console.log('Allowing request without origin');
      return callback(null, true);
    }

    // En desarrollo, permitir localhost en cualquier puerto
    if (config.nodeEnv === 'development' && origin.includes('localhost')) {
      console.log('Allowing localhost in development');
      return callback(null, true);
    }

    // En producción de Firebase Functions, permitir el dominio de la función
    if (origin.includes('api-rpdq2m3giq-uc.a.run.app')) {
      console.log('Allowing Firebase Functions domain');
      return callback(null, true);
    }

    // Verificar lista de orígenes permitidos
    if (config.cors.allowedOrigins.includes(origin)) {
      console.log('Origin found in allowed list');
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      console.log('Available origins:', config.cors.allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 horas
};

export const corsMiddleware = cors(corsOptions);
