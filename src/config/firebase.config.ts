import * as admin from 'firebase-admin';
import { config } from './env.config';

/**
 * Configuración de Firebase Admin SDK
 * Singleton pattern para asegurar una única instancia
 */
class FirebaseConfig {
  private static instance: FirebaseConfig;
  private app: admin.app.App;
  private db: admin.firestore.Firestore;

  private constructor() {
    // Inicializar Firebase Admin SDK
    if (config.nodeEnv === 'production') {
      // En producción (Cloud Functions), las credenciales se cargan automáticamente
      this.app = admin.initializeApp();
    } else {
      // En desarrollo, usar credenciales del archivo .env
      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebase.projectId,
          privateKey: config.firebase.privateKey.replace(/\\n/g, '\n'),
          clientEmail: config.firebase.clientEmail,
        }),
      });
    }

    this.db = this.app.firestore();

    // Configuración de Firestore
    this.db.settings({
      ignoreUndefinedProperties: true,
    });
  }

  /**
   * Obtiene la instancia única de FirebaseConfig (Singleton)
   */
  public static getInstance(): FirebaseConfig {
    if (!FirebaseConfig.instance) {
      FirebaseConfig.instance = new FirebaseConfig();
    }
    return FirebaseConfig.instance;
  }

  /**
   * Obtiene la instancia de Firestore
   */
  public getFirestore(): admin.firestore.Firestore {
    return this.db;
  }

  /**
   * Obtiene la instancia de la app de Firebase
   */
  public getApp(): admin.app.App {
    return this.app;
  }
}

// Exportar instancia única
export const firebaseConfig = FirebaseConfig.getInstance();
export const db = firebaseConfig.getFirestore();
