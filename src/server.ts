import { createApp } from './app';
import { config } from './config/env.config';

/**
 * Servidor local para desarrollo
 * Ejecutar con: npm run dev
 */
const app = createApp();
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔥 Firebase Project: ${config.firebase.projectId || 'Not configured'}`);
  console.log(`\n📖 API Documentation:`);
  console.log(`   Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`   Swagger JSON: http://localhost:${PORT}/api-docs.json`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`   GET  /api/users/:email - Get user by email`);
  console.log(`   POST /api/users - Create user`);
  console.log(`   POST /api/users/check - Check if user exists`);
  console.log(`   GET  /api/tasks/user/:userId - Get all tasks for user`);
  console.log(`   GET  /api/tasks/:id - Get task by ID`);
  console.log(`   POST /api/tasks - Create task`);
  console.log(`   PUT  /api/tasks/:id - Update task`);
  console.log(`   PATCH /api/tasks/:id/toggle - Toggle task completion`);
  console.log(`   DELETE /api/tasks/:id - Delete task`);
});