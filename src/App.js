import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './pages/UsersList';
import EditUser from './pages/EditUser';
import Contact from './components/Contact'; // Import the Contact component

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

export const AuthContext = React.createContext();

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthState({ isAuthenticated: false, user: null, loading: false });
        return;
      }

      try {
        const response = await axios.get('https://localhost:7025/api/Auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAuthState({
          isAuthenticated: true,
          user: response.data,
          loading: false
        });
      } catch (err) {
        localStorage.removeItem('token');
        setAuthState({ isAuthenticated: false, user: null, loading: false });
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (token) => {
    localStorage.setItem('token', token);
    try {
      const response = await axios.get('https://localhost:7025/api/Auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAuthState({
        isAuthenticated: true,
        user: response.data,
        loading: false
      });
    } catch (err) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  };

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ ...authState, handleLogin, handleLogout }}>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Navbar at the top */}
          <Navbar />
          
          {/* Main content area that grows to fill space */}
          <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/edituser/:id" element={<EditUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} /> {/* Add this line */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          </main>
          
          {/* Footer at the bottom */}
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;