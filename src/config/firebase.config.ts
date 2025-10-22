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
    try {
      // Inicializar Firebase Admin SDK
      // Detectar si estamos en Cloud Run/Firebase Functions (donde las credenciales se cargan automáticamente)
      const isCloudRun = process.env.K_SERVICE || process.env.FUNCTION_NAME || config.nodeEnv === 'production';
      
      if (isCloudRun) {
        // En producción (Cloud Functions/Cloud Run), las credenciales se cargan automáticamente
        this.app = admin.initializeApp();
        console.log('Firebase initialized with automatic credentials (Cloud Run/Functions)');
      } else {
        // En desarrollo, usar credenciales del archivo .env
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: config.firebase.projectId,
            privateKey: config.firebase.privateKey.replace(/\\n/g, '\n'),
            clientEmail: config.firebase.clientEmail,
          }),
        });
        console.log('Firebase initialized with .env credentials (Development)');
      }

      this.db = this.app.firestore();

      // Configuración de Firestore
      this.db.settings({
        ignoreUndefinedProperties: true,
      });

      console.log(' Firebase initialized successfully');
    } catch (error) {
      console.error(' Error initializing Firebase:', error);
      throw error;
    }
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
