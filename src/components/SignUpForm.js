import React from 'react';
import PasswordInput from './PasswordInput';

function SignUpForm({ formData, handleChange, errors, showPassword, togglePasswordVisibility }) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="email">
          Email Address <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="cam@upstrategy.com.co"
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
        <label htmlFor="lastName">
          Last Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Bradley"
          required
          aria-describedby="lastName-error"
        />
        {errors.lastName && <span className="error" id="lastName-error">{errors.lastName}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="firstName">
          First Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Alan"
          required
          aria-describedby="firstName-error"
        />
        {errors.firstName && (
          <span className="error" id="firstName-error">{errors.firstName}</span>
        )}
      </div>
      <div className="form-group">
        <label>
          Date of Birth <span className="required">*</span>
        </label>
        <div className="date-of-birth">
          <select
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
            aria-label="Day of birth"
          >
            <option value="">Day</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
            aria-label="Month of birth"
          >
            <option value="">Month</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            aria-label="Year of birth"
          >
            <option value="">Year</option>
            {[...Array(100)].map((_, i) => (
              <option key={i} value={2025 - i}>
                {2025 - i}
              </option>
            ))}
          </select>
        </div>
        {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
      </div>
    </>
  );
}

export default SignUpForm;