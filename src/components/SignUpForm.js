import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

function SignUpForm({ formData, handleChange, errors, showPassword, togglePasswordVisibility, onSubmit }) {
  const [step, setStep] = useState(1);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const industries = [
    'Tecnología',
    'Construccion',
    'Salud',
    'Educación',
    'Finanzas',
    'Finca Raiz',
    'Otros'
  ];

  const countries = [
    'México',
    'España',
    'Argentina',
    'Colombia',
    'Chile',
    'Perú',
    'Estados Unidos',
    'Otros'
  ];

  const participantOptions = [
    'Solo yo',
    'De 2 a 9',
    'De 10 a 19',
    'De 20 a 49',
    'De 50 a 300',
    'Más de 300'
  ];

  const validateStep = () => {
    const validationErrors = {};

    if (step === 1) {
      if (formData.companyId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const companyExists = users.some((user) => user.companyId === formData.companyId);
        if (!companyExists) {
          validationErrors.companyId = 'El código de empresa no existe';
        }
      } else {
        if (!formData.companyName) {
          validationErrors.companyName = 'El nombre de la empresa es obligatorio';
        }
        if (!formData.industry) {
          validationErrors.industry = 'La industria es obligatoria';
        }
        if (!formData.participants) {
          validationErrors.participants = 'La cantidad de participantes es obligatoria';
        }
        if (!formData.country) {
          validationErrors.country = 'La región es obligatoria';
        }
      }
    } else if (step === 2) {
      if (!formData.firstName) {
        validationErrors.firstName = 'El nombre es obligatorio';
      }
      if (!formData.lastName) {
        validationErrors.lastName = 'El apellido es obligatorio';
      }
      if (!formData.email) {
        validationErrors.email = 'El correo es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        validationErrors.email = 'El correo no es válido';
      }
      if (!formData.password) {
        validationErrors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 8) {
        validationErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
      if (!formData.confirmPassword) {
        validationErrors.confirmPassword = 'La confirmación de la contraseña es obligatoria';
      } else if (formData.confirmPassword !== formData.password) {
        validationErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else if (step === 3) {
      if (formData.day && formData.month && formData.year) {
        const birthDate = new Date(`${formData.year}-${formData.month}-${formData.day}`);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          validationErrors.dateOfBirth = 'Debes tener al menos 18 años';
        }
      }
    }

    return validationErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      onSubmit({ errors: validationErrors });
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSkip = (e) => {
    e.preventDefault();
    onSubmit({ skip: true });
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      onSubmit({ errors: validationErrors });
      return;
    }
    onSubmit({ final: true });
  };

  return (
    <>
      {step === 1 && (
        <>
          <Step1
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            industries={industries}
            participantOptions={participantOptions}
            countries={countries}
          />
          <div className="form-navigation">
            <button type="button" className="submit-btn" onClick={handleNext}>
              Siguiente
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <Step2
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
          <div className="form-navigation">
            <button type="button" className="back-btn" onClick={handleBack}>
              Atrás
            </button>
            <button type="button" className="next-btn" onClick={handleNext}>
              Siguiente
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <Step3
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            days={days}
            months={months}
            years={years}
            countries={countries}
          />
          <div className="form-navigation">
            <button type="button" className="back-btn" onClick={handleBack}>
              Atrás
            </button>
            <button type="button" className="next-btn" onClick={handleFinalSubmit}>
              Saltar / Finalizar
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default SignUpForm;