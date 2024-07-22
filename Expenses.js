import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Expenses.css';

const Expenses = ({ walletAmount, setWalletAmount, bankAmount, setBankAmount }) => {
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseType, setExpenseType] = useState('cash');
  const [expenses, setExpenses] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/init', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming the token is stored in localStorage
          },
        });
        setExpenses(response.data.expenses || []);
        setWalletAmount(response.data.walletAmount || 0);
        setBankAmount(response.data.bankAmount || 0);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [setWalletAmount, setBankAmount]);

  const capitalizeCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  const handleExpenseCategoryChange = (e) => {
    const formattedCategory = capitalizeCategory(e.target.value.trim());
    setExpenseCategory(formattedCategory);
  };

  const handleExpenseAmountChange = (e) => {
    const value = e.target.value.trim();
    if (/^\d*\.?\d*$/.test(value)) {
      setExpenseAmount(value);
    }
  };

  const handleExpenseTypeChange = (e) => {
    setExpenseType(e.target.value);
  };

  const calculateTotalForCategory = (category) => {
    return expenses
      .filter((expense) => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const addExpense = async () => {
    const amount = parseFloat(expenseAmount);
    if (!isNaN(amount) && amount > 0 && expenseCategory) {
      if (
        (expenseType === 'cash' && amount > walletAmount) ||
        (expenseType === 'online' && amount > bankAmount)
      ) {
        toast.error('Insufficient funds in the selected payment method.', { autoClose: 500 });
        return;
      }

      const newExpense = {
        category: expenseCategory,
        amount: amount,
        type: expenseType,
      };

      try {
        const response = await axios.post('http://localhost:5000/api/expenses', newExpense, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming the token is stored in localStorage
          },
        });
        const savedExpense = response.data.expense;

        setExpenses((prevExpenses) => [...prevExpenses, savedExpense]);

        if (expenseType === 'cash') {
          setWalletAmount((prevAmount) => prevAmount - amount);
        } else if (expenseType === 'online') {
          setBankAmount((prevAmount) => prevAmount - amount);
        }

        setExpenseCategory('');
        setExpenseAmount('');
        toast.success('Expense added successfully!', { autoClose: 500 });
      } catch (error) {
        toast.error('Error adding expense.', { autoClose: 500 });
        console.error('Error adding expense:', error);
      }
    } else {
      toast.error('Please enter a valid category and positive amount.', { autoClose: 500 });
    }
  };

  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="container">
      <div className="balance-container">
        <div className="balance-section">
          <h3>Wallet Amount</h3>
          <p>₹{walletAmount.toFixed(2)}</p>
        </div>
        <div className="balance-section">
          <h3>Bank Amount</h3>
          <p>₹{bankAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="section">
        <h2>Add Expense:</h2>
        <div className="input-container">
          <input
            type="text"
            value={expenseCategory}
            onChange={handleExpenseCategoryChange}
            onBlur={(e) => setExpenseCategory(e.target.value.trim())}
            placeholder="Category"
            className="input"
          />
          <input
            type="number"
            value={expenseAmount}
            onChange={handleExpenseAmountChange}
            onBlur={(e) => setExpenseAmount(e.target.value.trim())}
            placeholder="Amount"
            className="input"
            pattern="\d*"
          />
          <select value={expenseType} onChange={handleExpenseTypeChange} className="input">
            <option value="cash">Cash</option>
            <option value="online">Online</option>
          </select>
          <button onClick={addExpense} className="button-expense">
            Add Expense
          </button>
        </div>
      </div>

      <div className="section">
        <h2>Expenses by Category</h2>
        {expenses.length > 0 ? (
          [...new Set(expenses.map(expense => expense.category))].map((category) => (
            <div
              key={category}
              className="category-container"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-header">
                <h3>{category}</h3>
                <p>Total: ₹{calculateTotalForCategory(category).toFixed(2)}</p>
              </div>
              {expandedCategory === category && (
                <div className="category-details">
                  <ul>
                    {expenses
                      .filter((expense) => expense.category === category)
                      .map((expense, index) => (
                        <li key={index}>
                          ₹{expense.amount.toFixed(2)} ({expense.type}) ({new Date(expense.dateTime).toLocaleString()})
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No expenses to display.</p>
        )}
      </div>
    </div>
  );
};

export default Expenses;
