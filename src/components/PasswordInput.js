import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function PasswordInput({ value, onChange, error, showPassword, togglePasswordVisibility }) {
  return (
    <div className="form-group">
      <label htmlFor="password">
        Password <span className="required">*</span>
      </label>
      <div className="input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={value}
          onChange={onChange}
          placeholder="Min 6 char"
          required
          aria-describedby="password-error"
        />
        <span
          className="icon eye"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
      {error && <span className="error" id="password-error">{error}</span>}
    </div>
  );
}

export default PasswordInput;