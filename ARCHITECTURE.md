# Arquitectura del Proyecto

## Resumen

Este proyecto implementa una API RESTful para gestión de tareas (TODO List) siguiendo los principios de **Clean Architecture** (Arquitectura Limpia) y **Hexagonal Architecture** (Arquitectura Hexagonal).

## Principios Aplicados

### 1. Clean Architecture

La aplicación está dividida en capas concéntricas, donde las dependencias fluyen hacia adentro:

```
┌─────────────────────────────────────────┐
│   Infrastructure (Firestore, HTTP)     │
│  ┌───────────────────────────────────┐ │
│  │    Application (Controllers)      │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │   Domain (Business Logic)   │  │ │
│  │  │   - Entities                │  │ │
│  │  │   - Use Cases               │  │ │
│  │  │   - Repository Interfaces   │  │ │
│  │  └─────────────────────────────┘  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Reglas:**
- La capa de dominio no depende de nada
- La capa de aplicación depende solo del dominio
- La capa de infraestructura depende de dominio y aplicación

### 2. SOLID Principles

#### Single Responsibility (S)
- Cada clase tiene una única responsabilidad
- `UserRepository`: Solo acceso a datos de usuarios
- `UserService`: Solo lógica de negocio de usuarios
- `UserController`: Solo manejo de requests HTTP

#### Open/Closed (O)
- Las interfaces permiten extensión sin modificación
- `IUserRepository` puede tener múltiples implementaciones (Firestore, MongoDB, etc.)

#### Liskov Substitution (L)
- Las implementaciones pueden sustituirse por sus abstracciones
- `UserRepository` puede sustituirse por cualquier implementación de `IUserRepository`

#### Interface Segregation (I)
- Interfaces específicas y pequeñas
- `IUserRepository` solo contiene métodos relacionados con usuarios

#### Dependency Inversion (D)
- Las capas superiores dependen de abstracciones, no de implementaciones
- `UserService` depende de `IUserRepository`, no de `UserRepository`

### 3. Domain-Driven Design (DDD)

#### Entities
- `User.ts`: Entidad de usuario con sus propiedades
- `Task.ts`: Entidad de tarea con sus propiedades

#### Value Objects
- Representados por DTOs (CreateUserDTO, UpdateTaskDTO)

#### Repositories
- Patrón Repository para abstraer el acceso a datos
- Interfaces en el dominio, implementaciones en infraestructura

#### Services (Use Cases)
- `UserService`: Casos de uso relacionados con usuarios
- `TaskService`: Casos de uso relacionados con tareas

#### Factories
- `UserFactory`: Creación y validación de usuarios
- `TaskFactory`: Creación y validación de tareas

## Estructura de Capas

### Domain Layer (Dominio)

**Ubicación:** `src/domain/`

**Responsabilidad:** Contiene la lógica de negocio pura, independiente de frameworks.

**Componentes:**
- **Entities**: Modelos del dominio (`User`, `Task`)
- **Repository Interfaces**: Contratos para acceso a datos
- **Use Cases/Services**: Lógica de negocio

**Reglas:**
- No depende de ninguna otra capa
- No conoce Express, Firebase u otros frameworks
- Solo contiene lógica de negocio pura

### Application Layer (Aplicación)

**Ubicación:** `src/application/`

**Responsabilidad:** Maneja la comunicación HTTP y orquesta los casos de uso.

**Componentes:**
- **Controllers**: Manejan requests/responses HTTP
- **Middlewares**: CORS, error handling
- **Routes**: Definición de endpoints
- **Validators**: Validación de entrada HTTP

**Reglas:**
- Depende solo de la capa de dominio
- Conoce Express pero no Firebase
- Transforma datos HTTP a objetos del dominio

### Infrastructure Layer (Infraestructura)

**Ubicación:** `src/infrastructure/`

**Responsabilidad:** Implementaciones concretas de interfaces del dominio.

**Componentes:**
- **Repositories**: Implementaciones usando Firestore
- **Database**: Configuración de Firebase

**Reglas:**
- Depende de la capa de dominio
- Implementa las interfaces definidas en el dominio
- Es la única capa que conoce Firestore

### Configuration Layer (Configuración)

**Ubicación:** `src/config/`

**Responsabilidad:** Configuración global de la aplicación.

**Componentes:**
- `env.config.ts`: Variables de entorno
- `firebase.config.ts`: Inicialización de Firebase

## Patrones de Diseño Implementados

### 1. Repository Pattern

**Problema:** Aislar la lógica de acceso a datos.

**Solución:**
```typescript
// Interface en dominio
interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
}

// Implementación en infraestructura
class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    // Lógica con Firestore
  }
}
```

**Beneficios:**
- Facilita cambiar la BD sin afectar la lógica de negocio
- Permite testing con mocks
- Separa responsabilidades

### 2. Factory Pattern

**Problema:** Centralizar la creación de objetos complejos.

**Solución:**
```typescript
class UserFactory {
  static create(email: string): Omit<User, 'id'> {
    return {
      email: email.toLowerCase().trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static validate(email: string): boolean {
    // Validación
  }
}
```

**Beneficios:**
- Validación centralizada
- Lógica de creación reutilizable
- Consistencia en la creación de objetos

### 3. Singleton Pattern

**Problema:** Garantizar una única instancia de Firebase.

**Solución:**
```typescript
class FirebaseConfig {
  private static instance: FirebaseConfig;

  private constructor() {
    // Inicialización
  }

  public static getInstance(): FirebaseConfig {
    if (!FirebaseConfig.instance) {
      FirebaseConfig.instance = new FirebaseConfig();
    }
    return FirebaseConfig.instance;
  }
}
```

**Beneficios:**
- Una sola conexión a Firebase
- Control centralizado
- Eficiencia de recursos

### 4. Dependency Injection

**Problema:** Desacoplar dependencias entre clases.

**Solución:**
```typescript
class UserService {
  constructor(private readonly userRepository: IUserRepository) {}
}

// En app.ts
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
```

**Beneficios:**
- Facilita testing con mocks
- Bajo acoplamiento
- Flexibilidad para cambiar implementaciones

### 5. Async Handler Pattern

**Problema:** Evitar try-catch repetitivo en controladores.

**Solución:**
```typescript
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Uso
getUserByEmail = asyncHandler(async (req, res) => {
  // No necesita try-catch
  const user = await this.userService.findByEmail(req.params.email);
  res.json({ data: user });
});
```

**Beneficios:**
- Código más limpio
- Manejo centralizado de errores
- Menos código repetitivo

## Flujo de Datos

### Request Flow (Flujo de una petición)

```
1. HTTP Request
   ↓
2. Middleware (CORS, Body Parser)
   ↓
3. Router (/api/users/:email)
   ↓
4. Validator (express-validator)
   ↓
5. Controller (UserController.getUserByEmail)
   ↓
6. Service (UserService.findByEmail)
   ↓
7. Repository (UserRepository.findByEmail)
   ↓
8. Firestore
   ↓
9. Response ← ← ← ← ← ← ← ←
```

### Ejemplo Completo: Crear una Tarea

```typescript
// 1. Request HTTP
POST /api/tasks
{
  "userId": "user123",
  "title": "Nueva tarea",
  "description": "Descripción"
}

// 2. Router (task.routes.ts)
router.post('/', createTaskValidator, validate, taskController.createTask);

// 3. Validator (task.validator.ts)
export const createTaskValidator = [
  body('userId').notEmpty(),
  body('title').notEmpty().isLength({ min: 1, max: 100 }),
  // ...
];

// 4. Controller (TaskController.ts)
createTask = asyncHandler(async (req, res) => {
  const task = await this.taskService.createTask(req.body);
  res.status(201).json({ data: task });
});

// 5. Service (TaskService.ts)
async createTask(dto: CreateTaskDTO): Promise<Task> {
  return await this.taskRepository.create(dto);
}

// 6. Repository (TaskRepository.ts)
async create(dto: CreateTaskDTO): Promise<Task> {
  const errors = TaskFactory.validate(dto);
  if (errors.length > 0) throw new Error(...);

  const taskData = TaskFactory.create(dto);
  const docRef = await db.collection('tasks').add(taskData);

  return { id: docRef.id, ...taskData };
}

// 7. Response
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task456",
    "userId": "user123",
    "title": "Nueva tarea",
    "description": "Descripción",
    "completed": false,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
// UserService.test.ts
describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      // ...
    };
    userService = new UserService(mockUserRepository);
  });

  it('should find user by email', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    const result = await userService.findByEmail('test@test.com');

    expect(result).toEqual(mockUser);
  });
});
```

### Integration Tests

```typescript
// task.routes.test.ts
describe('Task Routes', () => {
  it('should create a task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        userId: 'user123',
        title: 'Test task',
        description: 'Test description'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('Test task');
  });
});
```

## Escalabilidad

### Agregar un Nuevo Recurso (Ejemplo: Categories)

1. **Crear entidad** en `domain/entities/Category.ts`
2. **Crear interface** del repositorio en `domain/repositories/ICategoryRepository.ts`
3. **Crear servicio** en `domain/use-cases/CategoryService.ts`
4. **Implementar repositorio** en `infrastructure/repositories/CategoryRepository.ts`
5. **Crear controlador** en `application/controllers/CategoryController.ts`
6. **Crear validadores** en `application/validators/category.validator.ts`
7. **Crear rutas** en `application/routes/category.routes.ts`
8. **Agregar rutas** en `application/routes/index.ts`

### Cambiar Base de Datos

Para cambiar de Firestore a MongoDB:

1. Crear `MongoUserRepository` que implemente `IUserRepository`
2. Crear `MongoTaskRepository` que implemente `ITaskRepository`
3. Actualizar la inyección de dependencias en `app.ts`
4. **No tocar** dominio, servicios, controladores o rutas

## Mejores Prácticas Aplicadas

1. **DRY (Don't Repeat Yourself)**
   - Validadores reutilizables
   - Factories para lógica de creación
   - Async handler para manejo de errores

2. **KISS (Keep It Simple, Stupid)**
   - Funciones pequeñas y específicas
   - Lógica clara y directa
   - Sin over-engineering

3. **YAGNI (You Aren't Gonna Need It)**
   - Solo funcionalidades requeridas
   - Sin código especulativo
   - Implementación pragmática

4. **Separation of Concerns**
   - Cada capa tiene su responsabilidad
   - Separación clara entre lógica de negocio y tecnología
   - Cohesión alta, acoplamiento bajo

5. **Error Handling**
   - Errores manejados centralizadamente
   - Mensajes de error descriptivos
   - Logging adecuado

## Conclusión

Esta arquitectura proporciona:

- **Mantenibilidad**: Código organizado y fácil de entender
- **Testabilidad**: Componentes desacoplados fáciles de testear
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Flexibilidad**: Fácil cambiar implementaciones
- **Calidad**: Código robusto siguiendo mejores prácticas
