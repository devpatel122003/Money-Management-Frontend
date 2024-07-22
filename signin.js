import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';  // Import the CSS file

const SignIn = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value.trim());
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onLogin(username, password);
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="section">
        <div className="inputContainerSignin">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            onBlur={(e) => setUsername(e.target.value.trim())}
            className="inputSignin"
          />
        </div>
        <div className="inputContainerSignin">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={(e) => setPassword(e.target.value.trim())}
            className="inputSignin"
          />
        </div>
        <button type="submit" className="buttonSignin">Login</button>
      </form>
    </div>
  );
};

export default SignIn;
