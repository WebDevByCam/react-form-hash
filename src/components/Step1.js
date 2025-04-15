import React from 'react';

function Step1({ formData, handleChange, errors, industries, participantOptions, countries }) {
  return (
    <>
      <h3>Paso 1: Registra tu empresa o únete a una existente</h3>
      <div className="form-group">
        <label htmlFor="companyId">
          ID de la empresa
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="companyId"
            name="companyId"
            value={formData.companyId || ''}
            onChange={handleChange}
            placeholder="Ingresa el código de tu empresa"
            aria-describedby="companyId-error"
          />
        </div>
        {errors.companyId && <span className="error" id="companyId-error">{errors.companyId}</span>}
      </div>
      <div className="divider">
        <span>O</span>
      </div>
      {!formData.companyId && (
        <>
          <div className="form-group">
            <label htmlFor="companyName">
              Nombre de la Empresa <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                placeholder="Ingresa el nombre de tu empresa"
                required
                aria-describedby="companyName-error"
              />
            </div>
            {errors.companyName && <span className="error" id="companyName-error">{errors.companyName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="industry">
              Industria <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <select
                id="industry"
                name="industry"
                value={formData.industry || ''}
                onChange={handleChange}
                required
                aria-describedby="industry-error"
              >
                <option value="">Selecciona una industria</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            {errors.industry && <span className="error" id="industry-error">{errors.industry}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="participants">
              Cantidad de participantes, incluyendo usted <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <select
                id="participants"
                name="participants"
                value={formData.participants || ''}
                onChange={handleChange}
                required
                aria-describedby="participants-error"
              >
                <option value="">Selecciona una opción</option>
                {participantOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {errors.participants && <span className="error" id="participants-error">{errors.participants}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="country">
              Pais <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <select
                id="country"
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                required
                aria-describedby="country-error"
              >
                <option value="">Selecciona un pais</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            {errors.country && <span className="error" id="country-error">{errors.country}</span>}
          </div>
        </>
      )}
    </>
  );
}

export default Step1;