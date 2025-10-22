import { User, CreateUserDTO } from '../entities/User';


export interface IUserRepository {

  findByEmail(email: string): Promise<User | null>;

  findById(id: string): Promise<User | null>;

  create(dto: CreateUserDTO): Promise<User>;

  exists(email: string): Promise<boolean>;
}
