import express from 'express';
import cors from 'cors';
import authenticateToken from './middleware/auth.js';
import { registerUser, loginUser, getProfile } from './routes/auth.js';
import { createTask, getTasks, getTask, updateTask, deleteTask, completeTask, getUsers } from './routes/tasks.js';
import './database/init.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/profile', authenticateToken, getProfile);

// Task Routes
app.post('/api/tasks', authenticateToken, createTask);
app.get('/api/tasks', authenticateToken, getTasks);
app.get('/api/tasks/:id', authenticateToken, getTask);
app.put('/api/tasks/:id', authenticateToken, updateTask);
app.delete('/api/tasks/:id', authenticateToken, deleteTask);
app.patch('/api/tasks/:id/complete', authenticateToken, completeTask);

// Users Routes
app.get('/api/users', authenticateToken, getUsers);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Accessible from other machines at: http://<your-ip>:${PORT}`);
});
