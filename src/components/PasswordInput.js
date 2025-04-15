import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function PasswordInput({ value, onChange, error, showPassword, togglePasswordVisibility }) {
  return (
    <div className="form-group">
      <label htmlFor="password">
        Contraseña <span className="required">*</span>
      </label>
      <div className="input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={value}
          onChange={onChange}
          placeholder="Mínimo 8 caracteres"
          required
          aria-describedby="password-error"
        />
        <span onClick={togglePasswordVisibility} className="toggle-password">
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      {error && <span className="error" id="password-error">{error}</span>}
    </div>
  );
}

export default PasswordInput;