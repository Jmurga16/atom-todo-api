# ATOM Todo API

Backend API para la aplicación de gestión de tareas (TODO List) desarrollada como parte del Challenge Técnico Fullstack Developer de ATOM.

## Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Decisiones de Diseño](#decisiones-de-diseño)
- [Deploy en Firebase](#deploy-en-firebase)

## Características

- **API RESTful** completa para gestión de usuarios y tareas
- **Arquitectura Hexagonal/Limpia** con separación clara de capas
- **TypeScript** con tipado fuerte en todo el proyecto
- **Firebase Firestore** como base de datos NoSQL
- **Firebase Cloud Functions** para hosting serverless
- **Validación robusta** de datos con express-validator
- **Manejo centralizado de errores**
- **CORS configurado** para permitir requests del frontend
- **Patrones de diseño**: Repository, Factory, Singleton, Dependency Injection

## Arquitectura

El proyecto sigue los principios de **Arquitectura Limpia (Clean Architecture)** y **Arquitectura Hexagonal**, con clara separación de responsabilidades:

```
src/
├── domain/              # Capa de Dominio (Lógica de Negocio)
│   ├── entities/        # Entidades del dominio
│   ├── repositories/    # Interfaces de repositorios
│   └── use-cases/       # Casos de uso / Servicios
├── infrastructure/      # Capa de Infraestructura
│   └── repositories/    # Implementaciones concretas de repositorios
├── application/         # Capa de Aplicación
│   ├── controllers/     # Controladores HTTP
│   ├── middlewares/     # Middlewares de Express
│   ├── routes/          # Definición de rutas
│   └── validators/      # Validadores de entrada
└── config/              # Configuración de la aplicación
```

### Principios SOLID Aplicados

- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Las clases están abiertas a extensión pero cerradas a modificación
- **L**iskov Substitution: Las implementaciones pueden sustituirse por sus abstracciones
- **I**nterface Segregation: Interfaces específicas en lugar de interfaces generales
- **D**ependency Inversion: Dependemos de abstracciones, no de implementaciones concretas

## Tecnologías

- **Node.js** v18
- **TypeScript** v5
- **Express.js** v5
- **Firebase Admin SDK**
- **Firebase Functions**
- **Firebase Firestore**
- **Express Validator**
- **CORS**
- **Dotenv**

## Estructura del Proyecto

```
atom-todo-api/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── User.ts              # Entidad y Factory de Usuario
│   │   │   └── Task.ts              # Entidad y Factory de Tarea
│   │   ├── repositories/
│   │   │   ├── IUserRepository.ts   # Interface del repositorio de usuarios
│   │   │   └── ITaskRepository.ts   # Interface del repositorio de tareas
│   │   └── use-cases/
│   │       ├── UserService.ts       # Casos de uso de usuarios
│   │       └── TaskService.ts       # Casos de uso de tareas
│   ├── infrastructure/
│   │   └── repositories/
│   │       ├── UserRepository.ts    # Implementación Firestore - Usuarios
│   │       └── TaskRepository.ts    # Implementación Firestore - Tareas
│   ├── application/
│   │   ├── controllers/
│   │   │   ├── UserController.ts    # Controlador de usuarios
│   │   │   └── TaskController.ts    # Controlador de tareas
│   │   ├── middlewares/
│   │   │   ├── error.middleware.ts  # Manejo de errores
│   │   │   └── cors.middleware.ts   # Configuración CORS
│   │   ├── routes/
│   │   │   ├── user.routes.ts       # Rutas de usuarios
│   │   │   ├── task.routes.ts       # Rutas de tareas
│   │   │   └── index.ts             # Agregador de rutas
│   │   └── validators/
│   │       ├── user.validator.ts    # Validadores de usuario
│   │       └── task.validator.ts    # Validadores de tarea
│   ├── config/
│   │   ├── env.config.ts            # Configuración de variables de entorno
│   │   └── firebase.config.ts       # Configuración de Firebase (Singleton)
│   ├── app.ts                       # Configuración de Express
│   └── index.ts                     # Punto de entrada (Firebase Function)
├── .env.example                     # Ejemplo de variables de entorno
├── .gitignore
├── firebase.json                    # Configuración de Firebase
├── .firebaserc                      # Proyecto de Firebase
├── tsconfig.json                    # Configuración de TypeScript
├── package.json
└── README.md
```

## Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd atom-todo-api
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copiar el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

## Configuración

### Variables de Entorno

Editar el archivo `.env` con tus credenciales de Firebase:

```env
# Firebase Configuration
FB__PROJECT_ID=tu-proyecto-id
FB__PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FB__CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:4200,https://tu-frontend-domain.com
```

### Obtener Credenciales de Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Seleccionar tu proyecto
3. Ir a **Project Settings** > **Service Accounts**
4. Clic en **Generate New Private Key**
5. Copiar los valores del archivo JSON a tu `.env`

### Configurar Firebase CLI

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Login en Firebase
firebase login

# Inicializar proyecto (opcional si ya tienes firebase.json)
firebase init functions
```

Editar `.firebaserc` con tu ID de proyecto:

```json
{
  "projects": {
    "default": "tu-firebase-project-id"
  }
}
```

## Ejecución

### Desarrollo Local

```bash
# Ejecutar servidor de desarrollo con hot-reload
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Emulador de Firebase

```bash
# Ejecutar con Firebase Emulators
npm run serve
```

Esto iniciará:
- Functions en `http://localhost:5001`
- Firestore Emulator en `http://localhost:8080`
- Emulator UI en `http://localhost:4000`

### Build

```bash
# Compilar TypeScript a JavaScript
npm run build
```

Los archivos compilados estarán en `dist/`

### Deploy a Firebase

```bash
# Deploy a Firebase Cloud Functions
npm run deploy
```

## API Endpoints

### Health Check

```
GET /api/health
```

Verifica que la API esté funcionando.

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Usuarios

#### 1. Buscar Usuario por Email

```
GET /api/users/:email
```

**Parámetros:**
- `email` (string): Email del usuario

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "usuario@ejemplo.com",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "userExists": true
}
```

**Response Not Found (404):**
```json
{
  "success": false,
  "message": "User not found",
  "userExists": false
}
```

#### 2. Crear Usuario

```
POST /api/users
```

**Body:**
```json
{
  "email": "nuevo@ejemplo.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "user456",
    "email": "nuevo@ejemplo.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 3. Verificar si Usuario Existe

```
POST /api/users/check
```

**Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "exists": true,
  "message": "User exists"
}
```

---

### Tareas

#### 1. Obtener Todas las Tareas de un Usuario

```
GET /api/tasks/user/:userId
```

**Parámetros:**
- `userId` (string): ID del usuario

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "task123",
      "userId": "user123",
      "title": "Completar el challenge",
      "description": "Desarrollar la API con Express y TypeScript",
      "completed": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### 2. Obtener Tarea por ID

```
GET /api/tasks/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "task123",
    "userId": "user123",
    "title": "Completar el challenge",
    "description": "Desarrollar la API",
    "completed": false,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

#### 3. Crear Tarea

```
POST /api/tasks
```

**Body:**
```json
{
  "userId": "user123",
  "title": "Nueva tarea",
  "description": "Descripción de la tarea"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task456",
    "userId": "user123",
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "completed": false,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### 4. Actualizar Tarea

```
PUT /api/tasks/:id
```

**Body:**
```json
{
  "title": "Título actualizado",
  "description": "Nueva descripción",
  "completed": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "task123",
    "userId": "user123",
    "title": "Título actualizado",
    "description": "Nueva descripción",
    "completed": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

#### 5. Alternar Estado de Completado

```
PATCH /api/tasks/:id/toggle
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task status toggled successfully",
  "data": {
    "id": "task123",
    "completed": true,
    ...
  }
}
```

#### 6. Eliminar Tarea

```
DELETE /api/tasks/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### Códigos de Error

- **400 Bad Request**: Datos de entrada inválidos
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: usuario ya existe)
- **500 Internal Server Error**: Error del servidor

**Formato de Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]
}
```

## Decisiones de Diseño

### 1. Arquitectura Hexagonal/Limpia

Se eligió esta arquitectura para:
- **Separar responsabilidades**: Cada capa tiene un propósito claro
- **Facilitar testing**: Las capas están desacopladas
- **Independencia de frameworks**: La lógica de negocio no depende de Express o Firebase
- **Mantenibilidad**: Código más organizado y fácil de mantener

### 2. Patrón Repository

Se implementó el patrón Repository para:
- **Abstraer el acceso a datos**: La lógica de negocio no conoce Firestore
- **Facilitar cambios**: Se puede cambiar Firestore por otra BD sin afectar el dominio
- **Testing**: Se pueden crear mocks de repositorios fácilmente

### 3. Factory Pattern

Se usa Factory para crear entidades:
- **Encapsular lógica de creación**: Validación y construcción centralizada
- **Consistencia**: Garantiza que las entidades se creen correctamente
- **Single Responsibility**: Separa la creación de la lógica de negocio

### 4. Singleton Pattern

Firebase se inicializa como Singleton:
- **Una única instancia**: Evita múltiples conexiones
- **Eficiencia**: Reutiliza la conexión existente
- **Control centralizado**: Configuración en un solo lugar

### 5. Dependency Injection

Los servicios reciben sus dependencias por constructor:
- **Desacoplamiento**: Las clases no crean sus dependencias
- **Testing**: Facilita el uso de mocks
- **Inversión de dependencias**: Cumple con el principio SOLID

### 6. TypeScript Estricto

Se usa TypeScript con configuración estricta:
- **Type Safety**: Prevención de errores en tiempo de compilación
- **Autocompletado**: Mejor experiencia de desarrollo
- **Documentación implícita**: Los tipos documentan el código
- **Refactoring seguro**: Cambios con confianza

### 7. Validación en Múltiples Capas

- **Validators (Express)**: Validación de entrada HTTP
- **Factories**: Validación de reglas de negocio
- **Repositories**: Validación antes de persistir

### 8. Manejo Centralizado de Errores

- **Error Middleware**: Todos los errores pasan por un middleware central
- **AppError**: Clase personalizada para errores operacionales
- **AsyncHandler**: Wrapper para evitar try-catch en cada controlador

## Deploy en Firebase

### Prerrequisitos

1. Proyecto de Firebase creado
2. Firestore habilitado
3. Firebase CLI instalado y autenticado

### Pasos

1. **Configurar proyecto**

Editar `.firebaserc`:
```json
{
  "projects": {
    "default": "tu-proyecto-id"
  }
}
```

2. **Build y Deploy**

```bash
npm run deploy
```

3. **Verificar deployment**

```bash
firebase functions:log
```

4. **URL de la función**

Después del deploy, Firebase mostrará la URL:
```
https://us-central1-tu-proyecto.cloudfunctions.net/api
```

### Configurar CORS para Producción

Editar `.env` en producción:
```env
ALLOWED_ORIGINS=https://tu-frontend.web.app,https://tu-dominio.com
```

## Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## Contribución

Este proyecto fue desarrollado como parte del Challenge Técnico Fullstack Developer de ATOM.

## Licencia

ISC

---

**Desarrollado con TypeScript, Express y Firebase**
