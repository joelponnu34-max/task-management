import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import './styles/app.css';

function App() {
  const { user, loading, logout } = useAuth();
  const [showApp, setShowApp] = useState(!!user);

  useEffect(() => {
    if (!loading) {
      setShowApp(!!user);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setShowApp(false);
  };

  const handleLoginSuccess = () => {
    setShowApp(true);
  };

  return (
    <div className="App">
      {showApp ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
