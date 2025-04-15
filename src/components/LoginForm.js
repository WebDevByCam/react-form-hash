import React from 'react';
import PasswordInput from './PasswordInput';

function LoginForm({ formData, handleChange, errors, showPassword, togglePasswordVisibility }) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="loginId">
          Correo o Usuario <span className="required">*</span>
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
    </>
  );
}

export default LoginForm;