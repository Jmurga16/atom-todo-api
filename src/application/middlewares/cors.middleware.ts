import cors from 'cors';
import { config } from '../../config/env.config';

/**
 * Configuración de CORS
 * Implementa el requisito de seguridad: "Configuración de CORS"
 */
export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (como mobile apps, curl, o Swagger UI)
    if (!origin) {
      return callback(null, true);
    }

    // En desarrollo, permitir localhost en cualquier puerto
    if (config.nodeEnv === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }

    // Verificar lista de orígenes permitidos
    if (config.cors.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 horas
};

export const corsMiddleware = cors(corsOptions);
