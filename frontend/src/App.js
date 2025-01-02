import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Register from './components/register';
import Login from './components/login';
import Dashboard from './components/dashboard';
import StorePassword from './components/storePassword';
import SearchPassword from './components/searchPassword';
import { IoMdLogIn } from "react-icons/io";


function App() {
  const navigate = useNavigate();

  // Check if the user is authenticated on initial load
  const isAuthenticated = !!localStorage.getItem('token');

  function clickHandler(page) {
    if (page === 'register') {
      navigate('/register');
    } else if (page === 'login') {
      navigate('/login');
    }
  }

  return (
    <div className="App">
      <h1>Password Vault</h1>
      {!isAuthenticated ? (
        <>
          <button onClick={() => clickHandler('register')}>Register</button>
          <br />
          <br />
          <button onClick={() => clickHandler('login')}>Login<IoMdLogIn /></button>
        </>
      ) : (
        <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      )}
    </div>
  );
}

function ProtectedRoute({ element, redirectTo }) {
  const isAuthenticated = !!localStorage.getItem('token');
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate(redirectTo); // Redirect to login page if not authenticated
    return null;
  }

  return element;
}

export default function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} redirectTo="/login" />}
        />
        <Route
          path="/store-password"
          element={<ProtectedRoute element={<StorePassword />} redirectTo="/login" />}
        />
        <Route
          path="/search-password"
          element={<ProtectedRoute element={<SearchPassword />} redirectTo="/login" />}
        />

      </Routes>
    </Router>
  );
}
