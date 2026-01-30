import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TaskList } from '../components/TaskList';
import '../styles/dashboard.css';

export const Dashboard = ({ onLogout }) => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📋 Task Manager</h1>
          <div className="user-info">
            <span>👤 {user?.username}</span>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>
      <TaskList />
    </div>
  );
};
