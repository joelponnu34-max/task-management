import React, { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import '../styles/auth.css';

export const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSuccess = () => {
    onLoginSuccess && onLoginSuccess();
  };

  return (
    <div className="auth-page">
      <div className="auth-toggle">
        <button
          onClick={() => setIsLogin(true)}
          className={isLogin ? 'active' : ''}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={!isLogin ? 'active' : ''}
        >
          Register
        </button>
      </div>

      {isLogin ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <RegisterForm onSuccess={handleSuccess} />
      )}

      <div className="auth-info">
        <p>Secure task management for your team</p>
      </div>
    </div>
  );
};
