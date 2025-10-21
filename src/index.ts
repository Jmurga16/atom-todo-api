import * as functions from 'firebase-functions';
import { createApp } from './app';

/**
 * Exportar la aplicación como Firebase Cloud Function
 * Esta función se desplegará en Firebase Functions
 * 
 * IMPORTANTE: No crear la app aquí para evitar ejecución durante la compilación
 */
export const api = functions.https.onRequest(createApp());
