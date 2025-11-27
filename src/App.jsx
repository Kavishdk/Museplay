import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Lobby from './pages/Lobby';
import { Appbar } from './components/Appbar';
import './App.css';

// Real auth helpers
import {
  fetchUserContext,
  getSessionToken,
} from '@/lib/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getSessionToken();
        if (token) {
          // Authenticated user
          const userDetails = await fetchUserContext();
          setUser(userDetails);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <Appbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={user ? <Lobby user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/room/:roomId"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;