import { onRequest } from 'firebase-functions/v2/https';
import { createApp } from './app';

/**
 * Exportar la aplicación como Firebase Cloud Function V2
 * Esta función se desplegará en Firebase Functions
 */
export const api = onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 540,
    memory: '512MiB',
    cors: true, // Habilitar CORS
    invoker: 'public' // Hacer la función pública
  },
  (req, res) => {
    const app = createApp();
    return app(req, res);
  }
);
