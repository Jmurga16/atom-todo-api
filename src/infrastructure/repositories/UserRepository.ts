import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, CreateUserDTO, UserFactory } from '../../domain/entities/User';
import { db } from '../../config/firebase.config';


export class UserRepository implements IUserRepository {
  private readonly collection = 'users';

  async findByEmail(email: string): Promise<User | null> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const snapshot = await db
        .collection(this.collection)
        .where('email', '==', normalizedEmail)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return this.mapDocumentToUser(doc);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user by email');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const doc = await db.collection(this.collection).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return this.mapDocumentToUser(doc);
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw new Error('Failed to find user by id');
    }
  }

  async create(dto: CreateUserDTO): Promise<User> {
    try {
      // Validar email
      if (!UserFactory.validate(dto.email)) {
        throw new Error('Invalid email format');
      }

      // Verificar si el usuario ya existe
      try {
        const existingUser = await this.findByEmail(dto.email);
        if (existingUser) {
          throw new Error('User already exists');
        }
      } catch (error) {
        // Si hay error al buscar el usuario, asumimos que no existe y continuamos
        console.warn('Warning: Could not verify if user exists, proceeding with creation:', error);
      }

      // Crear usuario usando Factory
      const userData = UserFactory.create(dto.email);

      // Guardar en Firestore
      const docRef = await db.collection(this.collection).add(userData);

      // Retornar usuario creado con ID
      return {
        id: docRef.id,
        ...userData,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async exists(email: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);
      return user !== null;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }

  private mapDocumentToUser(doc: FirebaseFirestore.DocumentSnapshot): User {
    const data = doc.data();

    if (!data) {
      throw new Error('Invalid document data');
    }

    return {
      id: doc.id,
      email: data.email,
      createdAt: data.createdAt?.toDate() || new Date()
    };
  }
}
