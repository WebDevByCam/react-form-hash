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
      <h1>Bienvenido al Futuro del Marketing!</h1>
      <p>Has ingresado correctamente al mejor Software del mundo.</p>
      <button className="submit-btn" onClick={handleLogout}>
        Cerrar Sesion
      </button>
    </div>
  );
}

export default Dashboard;