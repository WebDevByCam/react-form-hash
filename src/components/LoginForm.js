import React from 'react';
import PasswordInput from './PasswordInput';
import { FaGoogle } from 'react-icons/fa';

function LoginForm({ formData, handleChange, errors, showPassword, togglePasswordVisibility, onSubmit, toggleForm }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u) => (u.email === formData.loginId || u.username === formData.loginId) && u.password === formData.password
    );

    if (!user) {
      onSubmit({ errors: { authFailed: 'Usuario, alias o contraseña incorrectos' } });
      return;
    }

    if (user.status === 'pending') {
      onSubmit({
        errors: { authFailed: 'Tu registro está pendiente de aprobación. Por favor, espera la revisión de  un administrador.' },
      });
      return;
    }

    onSubmit({ success: true });
  };

  return (
    <div className="login-form">
      <div className="form-group">
        <label htmlFor="loginId">
          Correo O Usuario <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="loginId"
            name="loginId"
            value={formData.loginId}
            onChange={handleChange}
            placeholder="Ingresa tu correo o usuario"
            required
            aria-describedby="loginId-error"
          />
        </div>
        {errors.loginId && <span className="error" id="loginId-error">{errors.loginId}</span>}
      </div>
      <PasswordInput
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />
      <button type="submit" className="submit-btn">
        INICIAR SESIÓN
      </button>
      <div className="divider">
        <span>O</span>
      </div>
      <button type="button" className="connect-btn">
        <FaGoogle style={{ paddingLeft: '20px', paddingRight: '20px' }} />
      </button>
    </div>
  );
}

export default LoginForm;