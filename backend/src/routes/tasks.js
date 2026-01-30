import db from '../database/init.js';

export const createTask = (req, res) => {
  const { title, description, assigned_to } = req.body;
  const created_by = req.user.id;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  db.run(
    'INSERT INTO tasks (title, description, assigned_to, created_by, status) VALUES (?, ?, ?, ?, ?)',
    [title, description || '', assigned_to || null, created_by, 'pending'],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create task' });
      }
      res.status(201).json({ message: 'Task created successfully', taskId: this.lastID });
    }
  );
};

export const getTasks = (req, res) => {
  db.all(
    `SELECT t.*, u.username as created_by_name, a.username as assigned_to_name
     FROM tasks t
     LEFT JOIN users u ON t.created_by = u.id
     LEFT JOIN users a ON t.assigned_to = a.id
     ORDER BY t.created_at DESC`,
    (err, tasks) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch tasks' });
      }
      res.json(tasks);
    }
  );
};

export const getTask = (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT t.*, u.username as created_by_name, a.username as assigned_to_name
     FROM tasks t
     LEFT JOIN users u ON t.created_by = u.id
     LEFT JOIN users a ON t.assigned_to = a.id
     WHERE t.id = ?`,
    [id],
    (err, task) => {
      if (err || !task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    }
  );
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, assigned_to, status, completed } = req.body;

  db.run(
    `UPDATE tasks 
     SET title = COALESCE(?, title), 
         description = COALESCE(?, description),
         assigned_to = COALESCE(?, assigned_to),
         status = COALESCE(?, status),
         completed = COALESCE(?, completed),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [title, description, assigned_to, status, completed, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update task' });
      }
      res.json({ message: 'Task updated successfully' });
    }
  );
};

export const deleteTask = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete task' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
};

export const completeTask = (req, res) => {
  const { id } = req.params;

  db.run(
    `UPDATE tasks 
     SET completed = 1, status = 'completed', updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to complete task' });
      }
      res.json({ message: 'Task marked as complete' });
    }
  );
};

export const getUsers = (req, res) => {
  db.all('SELECT id, username, email FROM users', (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(users);
  });
};
