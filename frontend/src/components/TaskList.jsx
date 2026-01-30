import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/tasks.css';

const API_BASE_URL = `http://${window.location.hostname}:5000`;

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchUsers();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tasks`);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/api/tasks`, {
        title,
        description,
        assigned_to: assignedTo || null,
      });
      setTitle('');
      setDescription('');
      setAssignedTo('');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/tasks/${id}/complete`);
      fetchTasks();
    } catch (err) {
      setError('Failed to complete task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="task-container">
      <h1>Team Tasks</h1>

      <div className="task-form-container">
        <h2>Add New Task</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleAddTask}>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter task title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="Enter task description (optional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>

      <div className="tasks-list">
        <h2>Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Create one to get started!</p>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`status ${task.status}`}>{task.status}</span>
                </div>
                {task.description && <p className="task-description">{task.description}</p>}
                <div className="task-meta">
                  {task.assigned_to_name && <span className="assigned">👤 {task.assigned_to_name}</span>}
                  <span className="created-by">📝 By {task.created_by_name}</span>
                </div>
                <div className="task-actions">
                  {!task.completed && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="btn-complete"
                      title="Mark as complete"
                    >
                      ✓ Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn-delete"
                    title="Delete task"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
