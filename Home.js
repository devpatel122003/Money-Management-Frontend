import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Home.css';

const Home = () => {
  const [walletInput, setWalletInput] = useState('');
  const [bankInput, setBankInput] = useState('');
  const [addMoneyToWallet, setAddMoneyToWallet] = useState(false);
  const [addMoneyToBank, setAddMoneyToBank] = useState(false);
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
  const handleWalletInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setWalletInput(value);
    }
  };

  const handleBankInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setBankInput(value);
    }
  };

  const addWallet = async () => {
    const amount = parseFloat(walletInput);
    if (!isNaN(amount) && amount > 0) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/wallet', { amount }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWalletAmount((prevAmount) => prevAmount + amount);
        setWalletInput('');
        setAddMoneyToWallet(false);
        toast.success('Money added to wallet successfully!', { autoClose: 500 });
      } catch (error) {
        console.error('Error adding to wallet:', error);
        toast.error('Error adding to wallet.', { autoClose: 500 });
      }
    } else {
      toast.error('Please enter a valid positive number.', { autoClose: 500 });
    }
  };

  const addBank = async () => {
    const amount = parseFloat(bankInput);
    if (!isNaN(amount) && amount > 0) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/bank', { amount }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBankAmount((prevAmount) => prevAmount + amount);
        setBankInput('');
        setAddMoneyToBank(false);
        toast.success('Money added to bank successfully!', { autoClose: 500 });
      } catch (error) {
        console.error('Error adding to bank:', error);
        toast.error('Error adding to bank.', { autoClose: 500 });
      }
    } else {
      toast.error('Please enter a valid positive number.', { autoClose: 500 });
    }
  };

  const undoWallet = async () => {
    const amount = parseFloat(walletInput);
    if (!isNaN(amount) && amount > 0) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/wallet/undo', { amount }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWalletAmount((prevAmount) => prevAmount - amount);
        setWalletInput('');
        setAddMoneyToWallet(false);
        toast.success('Money removed from wallet successfully!', { autoClose: 500 });
      } catch (error) {
        console.error('Error removing from wallet:', error);
        toast.error('Error removing from wallet.', { autoClose: 500 });
      }
    } else {
      toast.error('Please enter a valid positive number.', { autoClose: 500 });
    }
  };

  const undoBank = async () => {
    const amount = parseFloat(bankInput);
    if (!isNaN(amount) && amount > 0) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/bank/undo', { amount }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBankAmount((prevAmount) => prevAmount - amount);
        setBankInput('');
        setAddMoneyToBank(false);
        toast.success('Money removed from bank successfully!', { autoClose: 500 });
      } catch (error) {
        console.error('Error removing from bank:', error);
        toast.error('Error removing from bank.', { autoClose: 500 });
      }
    } else {
      toast.error('Please enter a valid positive number.', { autoClose: 500 });
    }
  };

  const totalAmountOwned = walletAmount + bankAmount;

  return (
    <div className="container">
      <div className="section">
        <h2>Total Amount in Wallet: </h2>
        <h2>₹{walletAmount.toFixed(2)}</h2>

        {addMoneyToWallet && (
          <div className="inputContainer">
            <input
              type="number"
              value={walletInput}
              onChange={handleWalletInputChange}
              placeholder="Enter amount to add"
              className="input"
            />
            <button onClick={addWallet} className="button">Add</button>
            <button onClick={undoWallet} className="button">Undo</button>
          </div>
        )}

        {!addMoneyToWallet && (
          <div className="inputContainer">
            <button onClick={() => setAddMoneyToWallet(true)} className="button">Add/Undo Money</button>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Total Amount in Bank: </h2>
        <h2>₹{bankAmount.toFixed(2)}</h2>

        {addMoneyToBank && (
          <div className="inputContainer">
            <input
              type="number"
              value={bankInput}
              onChange={handleBankInputChange}
              placeholder="Enter amount to add"
              className="input"
            />
            <button onClick={addBank} className="button">Add</button>
            <button onClick={undoBank} className="button">Undo</button>
          </div>
        )}

        {!addMoneyToBank && (
          <div className="inputContainer">
            <button onClick={() => setAddMoneyToBank(true)} className="button">Add/Undo Money</button>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Total Amount Owned: </h2>
        <h2>₹{totalAmountOwned.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default Home;
