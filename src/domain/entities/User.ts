export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserDTO {
  email: string;
}

export class UserFactory {
  static create(email: string): Omit<User, 'id'> {
    const now = new Date();

    return {
      email: email.toLowerCase().trim(),
      createdAt: now
    };
  }

  static validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
