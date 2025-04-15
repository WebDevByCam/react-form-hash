import React from 'react';
import PasswordInput from './PasswordInput';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Step2({ formData, handleChange, errors, showPassword, togglePasswordVisibility }) {
  return (
    <>
      <h3>Paso 2: Regístrate como parte de la empresa</h3>
      <div className="form-group">
        <label htmlFor="firstName">
          Nombre <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            required
            aria-describedby="firstName-error"
          />
        </div>
        {errors.firstName && <span className="error" id="firstName-error">{errors.firstName}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="lastName">
          Apellido <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Ingresa tu apellido"
            required
            aria-describedby="lastName-error"
          />
        </div>
        {errors.lastName && <span className="error" id="lastName-error">{errors.lastName}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="email">
          Correo <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingresa tu correo electrónico"
            required
            aria-describedby="email-error"
          />
        </div>
        {errors.email && <span className="error" id="email-error">{errors.email}</span>}
      </div>
      <PasswordInput
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />
      <div className="form-group">
        <label htmlFor="confirmPassword">
          Confirmar Contraseña <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword || ''}
            onChange={handleChange}
            placeholder="Confirma tu contraseña"
            required
            aria-describedby="confirmPassword-error"
          />
          <span onClick={togglePasswordVisibility} className="toggle-password">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.confirmPassword && <span className="error" id="confirmPassword-error">{errors.confirmPassword}</span>}
      </div>
    </>
  );
}

export default Step2;