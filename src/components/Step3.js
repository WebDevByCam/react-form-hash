import React from 'react';

function Step3({ formData, handleChange, errors, days, months, years, countries }) {
  return (
    <>
      <h3>Paso 3: Completa tu perfil (opcional)</h3>
      <div className="form-group">
        <label htmlFor="username">
          Usuario o alias
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            placeholder="Ingresa tu usuario o alias"
            aria-describedby="username-error"
          />
        </div>
        {errors.username && <span className="error" id="username-error">{errors.username}</span>}
      </div>
      <div className="form-group">
        <label>
          Fecha de Nacimiento
        </label>
        <div className="date-inputs">
          <select name="day" value={formData.day} onChange={handleChange}>
            <option value="">Día</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select name="month" value={formData.month} onChange={handleChange}>
            <option value="">Mes</option>
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <select name="year" value={formData.year} onChange={handleChange}>
            <option value="">Año</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="phone">
          Teléfono
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="Ingresa tu número de teléfono"
            aria-describedby="phone-error"
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="secondaryEmail">
          Correo Secundario
        </label>
        <div className="input-wrapper">
          <input
            type="email"
            id="secondaryEmail"
            name="secondaryEmail"
            value={formData.secondaryEmail || ''}
            onChange={handleChange}
            placeholder="Ingresa un correo secundario"
            aria-describedby="secondaryEmail-error"
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="address">
          Dirección
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            placeholder="Ingresa tu dirección"
            aria-describedby="address-error"
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="city">
          Ciudad
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            placeholder="Ingresa tu ciudad"
            aria-describedby="city-error"
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="countryOptional">
          País
        </label>
        <div className="input-wrapper">
          <select
            id="countryOptional"
            name="countryOptional"
            value={formData.countryOptional || ''}
            onChange={handleChange}
            aria-describedby="countryOptional-error"
          >
            <option value="">Selecciona un país</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default Step3;