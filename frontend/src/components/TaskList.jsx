import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { createClient } from '@supabase/supabase-js';
import '../styles/tasks.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY
);

export const TaskList = () => {
  const { tasks, loading, error, createTask, updateTask, deleteTask, completeTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [localError, setLocalError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setLocalError('Task title is required');
      return;
    }

    setIsCreating(true);
    setLocalError('');

    try {
      await createTask({
        title,
        description,
        priority,
        due_date: dueDate || null,
        category: category || null,
        status: 'pending',
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setCategory('');
    } catch (err) {
      setLocalError(err.message || 'Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      setLocalError('');
      await updateTask(taskId, updates);
      setEditingId(null);
      setEditData({});
    } catch (err) {
      setLocalError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLocalError('');
        await deleteTask(taskId);
      } catch (err) {
        setLocalError(err.message || 'Failed to delete task');
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const getPriorityColor = (priority) => {
    return priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981';
  };

  const displayError = localError || error;

  return (
    <div className="task-container">
      <h1>Tasks</h1>

      <div className="task-form-container">
        <h2>Create New Task</h2>
        {displayError && <div className="error-message">{displayError}</div>}
        <form onSubmit={handleAddTask}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isCreating}
                placeholder="Task title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={isCreating}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isCreating}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isCreating}
                placeholder="e.g., Work, Personal"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              placeholder="Task description (optional)"
              rows="3"
            />
          </div>
          <button type="submit" disabled={isCreating} className="btn-primary">
            {isCreating ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>

      <div className="tasks-list">
        <div className="tasks-header">
          <h2>Tasks ({filteredTasks.length})</h2>
          <div className="filters">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="filter-select">
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading">Loading tasks...</div>}
        {!loading && filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Create one to get started!</p>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <div key={task.id} className={`task-card ${task.status}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="task-badges">
                    <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                      {task.priority}
                    </span>
                    <span className={`status-badge ${task.status}`}>{task.status}</span>
                  </div>
                </div>
                {task.description && <p className="task-description">{task.description}</p>}
                <div className="task-meta">
                  {task.category && <span className="category">📁 {task.category}</span>}
                  {task.due_date && <span className="due-date">📅 {new Date(task.due_date).toLocaleDateString()}</span>}
                </div>
                <div className="task-actions">
                  {task.status !== 'completed' && (
                    <>
                      {task.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateTask(task.id, { status: 'in_progress' })}
                          className="btn-action btn-start"
                          title="Start task"
                        >
                          Start
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => completeTask(task.id)}
                          className="btn-action btn-complete"
                          title="Mark as complete"
                        >
                          Complete
                        </button>
                      )}
                    </>
                  )}
                  {task.status === 'completed' && (
                    <button
                      onClick={() => handleUpdateTask(task.id, { status: 'pending' })}
                      className="btn-action btn-reopen"
                      title="Reopen task"
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn-action btn-delete"
                    title="Delete task"
                  >
                    Delete
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
