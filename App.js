import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Expenses from './pages/Expenses';
import Login from './pages/signin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const App = () => {
  const [walletAmount, setWalletAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/init', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setWalletAmount(response.data.walletAmount || 0);
        setBankAmount(response.data.bankAmount || 0);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      if (response.data.message === 'Signup successful') {
        toast.success('Signed up successfully',{ autoClose: 500 });
      } else {
        toast.success('Logged in successfully',{ autoClose: 500 });
      }
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response && error.response.data.error === 'InvalidCredentials') {
        toast.error('Invalid credentials',{ autoClose: 500 });
      } else {
        toast.error('Error logging in or signing up',{ autoClose: 500 });
      }
      console.error('Error logging in:', error);
    }
  };

  return (
    <BrowserRouter>
      <div>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={isAuthenticated ? (
            <Home
            />
          ) : (
            <Navigate to="/signin" />
          )} />
          <Route path="/expenses" element={isAuthenticated ? (
            <Expenses
              walletAmount={walletAmount}
              bankAmount={bankAmount}
              setWalletAmount={setWalletAmount}
              setBankAmount={setBankAmount}
            />
          ) : (
            <Navigate to="/signin" />
          )} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
