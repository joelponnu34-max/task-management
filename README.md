# Task Management Website

A modern, secure team task management application with authentication, real-time collaboration, and a beautiful user interface.

## Features

✅ **User Authentication** - Secure login and registration with JWT tokens  
✅ **Task Management** - Create, read, update, delete, and complete tasks  
✅ **Team Collaboration** - Assign tasks to team members  
✅ **Database Storage** - SQLite for persistent data  
✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **Protected Routes** - Only authenticated users can access the app  

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Modern styling

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── server.js          # Express app entry point
│   │   ├── routes/
│   │   │   ├── auth.js        # Authentication endpoints
│   │   │   └── tasks.js       # Task management endpoints
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT authentication middleware
│   │   └── database/
│   │       └── init.js        # SQLite database setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # React entry point
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx   # Login/Register page
│   │   │   └── Dashboard.jsx  # Main dashboard
│   │   ├── components/
│   │   │   ├── LoginForm.jsx  # Login form
│   │   │   ├── RegisterForm.jsx # Register form
│   │   │   └── TaskList.jsx   # Tasks list & creation
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state management
│   │   ├── styles/            # CSS files
│   │   └── index.html         # HTML entry point
│   ├── vite.config.js         # Vite configuration
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server in development mode:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Tasks
- `POST /api/tasks` - Create a new task (protected)
- `GET /api/tasks` - Get all tasks (protected)
- `GET /api/tasks/:id` - Get a specific task (protected)
- `PUT /api/tasks/:id` - Update a task (protected)
- `DELETE /api/tasks/:id` - Delete a task (protected)
- `PATCH /api/tasks/:id/complete` - Mark task as complete (protected)

### Users
- `GET /api/users` - Get all users (protected)

## Usage

1. **Open the application** in your browser at `http://localhost:3000`

2. **Register** a new account with:
   - Username
   - Email
   - Password (and confirmation)

3. **Login** with your credentials

4. **Create tasks** by filling in the form:
   - Task title (required)
   - Description (optional)
   - Assign to team member (optional)

5. **Manage tasks**:
   - Mark tasks as complete
   - Delete completed tasks
   - View who created and assigned the task

## Database

The application uses SQLite with two main tables:

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to INTEGER,
  created_by INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
)
```

## Security Features

- **Password Hashing** - Passwords are hashed using bcryptjs
- **JWT Tokens** - Secure token-based authentication
- **Protected Routes** - API endpoints require valid JWT token
- **CORS** - Cross-origin requests are handled safely
- **Email Validation** - Email addresses are validated and unique

## Development

### Building Frontend for Production
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Troubleshooting

**Port Already in Use**
- Backend: Change port in backend/src/server.js
- Frontend: Vite will automatically use a different port if 3000 is occupied

**Database Issues**
- The SQLite database is created automatically on first run
- Database file is stored at `backend/tasks.db`

**CORS Errors**
- Ensure backend server is running on port 5000
- Check frontend vite.config.js proxy settings

## Future Enhancements

- [ ] Task priorities and due dates
- [ ] Task categories/tags
- [ ] Comments on tasks
- [ ] Task notifications
- [ ] User roles and permissions
- [ ] Activity log
- [ ] Export tasks to CSV/PDF

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues or questions, please check the code comments or create an issue in your repository.

---

Built with ❤️ for team collaboration
