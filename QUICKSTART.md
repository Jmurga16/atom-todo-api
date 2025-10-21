# Quick Start Guide

Guía rápida para poner en marcha el backend de ATOM Todo API.

## Prerrequisitos

- Node.js v18 o superior
- npm o yarn
- Cuenta de Firebase
- Git

## Instalación Rápida (5 minutos)

### 1. Clonar e Instalar

```bash
# Clonar repositorio
git clone <tu-repositorio>
cd atom-todo-api

# Instalar dependencias
npm install
```

### 2. Configurar Firebase

#### Opción A: Crear un nuevo proyecto

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en "Add project"
3. Nombre: `atom-todo-app` (o el que prefieras)
4. Habilita Google Analytics (opcional)

#### Opción B: Usar proyecto existente

1. Ve a tu proyecto en Firebase Console

#### Configurar Firestore

1. En el menú lateral, ve a **Firestore Database**
2. Clic en "Create database"
3. Selecciona "Start in test mode" (para desarrollo)
4. Elige la región más cercana

### 3. Obtener Credenciales

1. En Firebase Console, ve a **Project Settings** (ícono de engranaje)
2. Ve a la pestaña **Service Accounts**
3. Clic en **Generate new private key**
4. Descargar el archivo JSON

### 4. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Abrir `.env` y completar con los datos del JSON descargado:

```env
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com

PORT=3000
NODE_ENV=development

ALLOWED_ORIGINS=http://localhost:4200
```

**Importante:** Asegúrate de que la private key incluya `\n` entre líneas.

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

Deberías ver:

```
🚀 Server running on port 3000
📝 Environment: development
🔥 Firebase Project: tu-proyecto-id

📚 API Endpoints:
   GET  /api/health - Health check
   ...
```

### 6. Probar la API

```bash
# Health check
curl http://localhost:3000/api/health

# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Buscar usuario
curl http://localhost:3000/api/users/test@example.com
```

## Comandos Útiles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar producción
npm start

# Emuladores de Firebase
npm run serve

# Deploy a Firebase
npm run deploy
```

## Estructura de URLs

**Local:**
- Base URL: `http://localhost:3000`
- API: `http://localhost:3000/api`

**Producción (Firebase):**
- `https://REGION-PROJECT-ID.cloudfunctions.net/api`

## Endpoints Principales

### Usuarios

```bash
# Buscar usuario
GET /api/users/:email

# Crear usuario
POST /api/users
Body: { "email": "user@example.com" }

# Verificar existencia
POST /api/users/check
Body: { "email": "user@example.com" }
```

### Tareas

```bash
# Obtener tareas del usuario
GET /api/tasks/user/:userId

# Crear tarea
POST /api/tasks
Body: {
  "userId": "user123",
  "title": "Mi tarea",
  "description": "Descripción"
}

# Actualizar tarea
PUT /api/tasks/:id
Body: {
  "title": "Nuevo título",
  "completed": true
}

# Eliminar tarea
DELETE /api/tasks/:id
```

## Troubleshooting

### Error: "Missing environment variables"

**Solución:** Verifica que el archivo `.env` exista y tenga todas las variables.

### Error: "Permission denied" en Firestore

**Solución:**
1. Ve a Firestore Database > Rules
2. Cambia temporalmente a:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Nota:** Esto es solo para desarrollo. En producción usa reglas de seguridad apropiadas.

### Error: "CORS policy"

**Solución:** Agrega el origen de tu frontend a `ALLOWED_ORIGINS` en `.env`:

```env
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000
```

### Puerto 3000 ya en uso

**Solución:** Cambia el puerto en `.env`:

```env
PORT=3001
```

## Deploy a Firebase Functions

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login

```bash
firebase login
```

### 3. Configurar proyecto

Edita `.firebaserc`:

```json
{
  "projects": {
    "default": "tu-proyecto-id"
  }
}
```

### 4. Deploy

```bash
npm run deploy
```

### 5. Obtener URL

Después del deploy, verás:

```
✔  Deploy complete!

Function URL (api):
https://us-central1-tu-proyecto.cloudfunctions.net/api
```

### 6. Actualizar CORS

En `.env` de producción (Firebase Console > Functions > Configuración):

```env
ALLOWED_ORIGINS=https://tu-frontend.web.app
```

## Testing con Postman/Thunder Client

### Importar colección

Crear archivo `api-collection.json`:

```json
{
  "info": {
    "name": "ATOM Todo API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/health"
      }
    },
    {
      "name": "Create User",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/users",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\"\n}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

## Próximos Pasos

1. **Conectar con Frontend Angular:** El frontend llamará estos endpoints
2. **Agregar Autenticación:** Implementar Firebase Auth si es necesario
3. **Configurar CI/CD:** Automatizar deploys
4. **Agregar Tests:** Escribir pruebas unitarias e integración
5. **Monitoreo:** Configurar logging y analytics

## Recursos Adicionales

- [README.md](./README.md) - Documentación completa
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detalles de arquitectura
- [Firebase Docs](https://firebase.google.com/docs)
- [Express Docs](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## Soporte

Si tienes problemas:

1. Revisa la consola de Firebase para errores
2. Verifica los logs: `firebase functions:log`
3. Comprueba que todas las variables de entorno estén configuradas
4. Asegúrate de que Firestore esté habilitado y accesible

---

**¡Listo para desarrollar!** 🚀
