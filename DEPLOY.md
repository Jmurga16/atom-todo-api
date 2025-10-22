# Guía de Despliegue - ATOM Todo API

Esta guía te ayudará a desplegar la API en Firebase Cloud Functions paso a paso.

## Requisitos Previos

1. **Node.js** (versión 20 o superior)
2. **npm** (incluido con Node.js)
3. **Cuenta de Firebase** (gratuita en https://firebase.google.com)
4. **Firebase CLI** instalado globalmente

```bash
npm install -g firebase-tools
```

## Paso 1: Configurar el Proyecto de Firebase

### 1.1 Iniciar sesión en Firebase

```bash
firebase login
```

Esto abrirá una ventana del navegador para autenticarte con tu cuenta de Google.

### 1.2 Crear un Proyecto en Firebase Console

1. Ve a https://console.firebase.google.com
2. Haz clic en "Agregar proyecto"
3. Ingresa un nombre (ej: `atom-todo-app`)
4. Sigue los pasos del asistente
5. Habilita Google Analytics si lo deseas (opcional)

### 1.3 Habilitar Firestore Database

1. En la consola de Firebase, selecciona tu proyecto
2. Ve a "Build" > "Firestore Database"
3. Haz clic en "Create database"
4. Selecciona el modo:
   - **Modo de prueba** (para desarrollo): Permite lectura/escritura sin autenticación
   - **Modo de producción** (recomendado): Requiere reglas de seguridad
5. Selecciona una ubicación (ej: `us-central1`)
6. Haz clic en "Enable"

### 1.4 Configurar el Proyecto Localmente

Si el archivo `.firebaserc` no existe o está desactualizado:

```bash
# Vincular el proyecto de Firebase
firebase use --add

# Selecciona tu proyecto de la lista y dale un alias (ej: default)
```

Verifica que `.firebaserc` contenga:

```json
{
  "projects": {
    "default": "tu-project-id"
  }
}
```

## Paso 2: Configurar Variables de Entorno

### 2.1 Crear el archivo `.env`

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

### 2.2 Obtener las Credenciales de Firebase

#### Opción A: Para Desarrollo Local (con Service Account)

1. Ve a Firebase Console > Project Settings (⚙️) > Service Accounts
2. Haz clic en "Generate New Private Key"
3. Descarga el archivo JSON
4. Extrae los valores necesarios:

```env
FB__PROJECT_ID=tu-project-id
FB__PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
FB__CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project-id.iam.gserviceaccount.com
```

**IMPORTANTE**: Mantén la clave privada en formato de una línea con `\n` para los saltos de línea.

#### Opción B: Para Producción (Cloud Functions)

En producción, Firebase Cloud Functions utiliza credenciales automáticas. Solo necesitas configurar:

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://tu-frontend-app.web.app,https://tu-dominio-personalizado.com
```

### 2.3 Configurar CORS

En el archivo `.env`, especifica los orígenes permitidos:

```env
ALLOWED_ORIGINS=http://localhost:4200,https://tu-frontend-app.web.app
```

## Paso 3: Instalar Dependencias

```bash
npm install
```

## Paso 4: Probar Localmente

### 4.1 Compilar el Proyecto

```bash
npm run build
```

Esto compilará TypeScript a JavaScript en la carpeta `dist/`.

### 4.2 Ejecutar en Modo Desarrollo

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`.

### 4.3 Probar con Emuladores de Firebase (Recomendado)

```bash
npm run serve
```

Esto iniciará:
- Firebase Functions en `http://localhost:5001`
- Firestore Emulator en `http://localhost:8080`
- Firebase Emulator UI en `http://localhost:4000`

La API estará en: `http://localhost:5001/[PROJECT-ID]/[REGION]/api`

Ejemplo: `http://localhost:5001/atom-todo-app/us-central1/api/health`

### 4.4 Ejecutar Tests

```bash
npm test
```

## Paso 5: Desplegar a Firebase Cloud Functions

### 5.1 Primera Despliegue

```bash
npm run deploy
```

Este comando:
1. Ejecuta `npm run build` (compila TypeScript)
2. Ejecuta `firebase deploy --only functions`

### 5.2 Verificar el Despliegue

Después del despliegue, verás en la consola:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/tu-project-id/overview
Function URL (api): https://[REGION]-[PROJECT-ID].cloudfunctions.net/api
```

### 5.3 Probar la API en Producción

```bash
curl https://[REGION]-[PROJECT-ID].cloudfunctions.net/api/health
```

Deberías recibir:

```json
{
  "status": "OK",
  "timestamp": "2024-10-21T...",
  "env": "production"
}
```

## Paso 6: Configurar Variables de Entorno en Cloud Functions

Para configurar variables de entorno en producción:

```bash
# Configurar todas las variables de una vez
firebase functions:config:set \
  cors.allowed_origins="https://tu-app.web.app,https://tu-dominio.com"

# Ver la configuración actual
firebase functions:config:get

# Redesplegar para aplicar los cambios
firebase deploy --only functions
```

## Paso 7: Configurar Reglas de Seguridad de Firestore

### 7.1 Reglas Básicas (Desarrollo)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura a todos (solo desarrollo)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 7.2 Reglas de Producción (Recomendadas)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: solo pueden leer/escribir su propio documento
    match /users/{userId} {
      allow read, write: if true; // Ajustar según autenticación
    }

    // Tareas: solo pueden leer/escribir sus propias tareas
    match /tasks/{taskId} {
      allow read, write: if true; // Ajustar según autenticación
    }
  }
}
```

**IMPORTANTE**: En producción, implementa autenticación y ajusta estas reglas según tus necesidades de seguridad.

## Paso 8: Monitoreo y Logs

### 8.1 Ver Logs en Tiempo Real

```bash
firebase functions:log
```

### 8.2 Ver Logs en Firebase Console

1. Ve a Firebase Console > Functions
2. Haz clic en la función `api`
3. Ve a la pestaña "Logs"

### 8.3 Ver Métricas

Firebase Console > Functions > Pestaña "Metrics" te mostrará:
- Número de invocaciones
- Tiempo de ejecución
- Errores
- Uso de memoria

## Paso 9: Actualizar el Frontend

Actualiza la URL del API en tu aplicación Angular:

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://[REGION]-[PROJECT-ID].cloudfunctions.net/api'
};
```

## Comandos Útiles

```bash
# Desarrollo local
npm run dev                    # Ejecutar en modo desarrollo
npm run serve                  # Emuladores de Firebase
npm test                       # Ejecutar tests

# Compilación
npm run build                  # Compilar TypeScript

# Despliegue
npm run deploy                 # Desplegar a Firebase Functions
firebase deploy --only functions  # Desplegar solo funciones
firebase deploy --only firestore  # Desplegar solo reglas de Firestore

# Logs y debugging
firebase functions:log         # Ver logs
firebase functions:config:get  # Ver configuración

# Otros
firebase projects:list         # Listar proyectos
firebase use [project-id]      # Cambiar de proyecto
```

## Solución de Problemas

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Insufficient permissions"

Asegúrate de que tu Service Account tenga los permisos necesarios en Firebase Console.

### Error: "CORS"

1. Verifica que el origen del frontend esté en `ALLOWED_ORIGINS`
2. Revisa los logs con `firebase functions:log`
3. Asegúrate de que el middleware CORS esté configurado correctamente

### Error: "Build failed"

```bash
# Verificar errores de TypeScript
npm run build

# Ver errores específicos
npx tsc --noEmit
```

### La función no se actualiza después del deploy

```bash
# Limpiar caché y redesplegar
npm run build
firebase deploy --only functions --force
```

## Próximos Pasos

1. **Configurar CI/CD**: Automatiza el despliegue con GitHub Actions
2. **Implementar Autenticación**: Usa Firebase Authentication
3. **Agregar Rate Limiting**: Protege contra abuso
4. **Configurar Alertas**: Monitorea errores en producción
5. **Optimizar Costos**: Revisa el uso y ajusta el plan de Firebase

## Recursos Adicionales

- [Firebase Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Swagger Documentation](https://[TU-URL]/api-docs)
