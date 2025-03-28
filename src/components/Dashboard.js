import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <h1>Welcome to Your Dashboard!</h1>
      <p>You have successfully logged in.</p>
      <button className="submit-btn" onClick={handleLogout}>
        LOG OUT
      </button>
    </div>
  );
}

export default Dashboard;