import cors from 'cors';

/**
 * Configuración de CORS
 * Implementa el requisito de seguridad: "Configuración de CORS"
 */
export const corsOptions: cors.CorsOptions = {
  origin: true, // Permitir todos los orígenes temporalmente para debug
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // 24 horas
};

export const corsMiddleware = cors(corsOptions);
