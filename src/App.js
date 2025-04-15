import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import PasswordInput from './components/PasswordInput';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import './App.css';
import bcrypt from 'bcryptjs';

const initialFormData = {
  loginId: '',
  email: '',
  password: '',
  confirmPassword: '',
  lastName: '',
  firstName: '',
  day: '',
  month: '',
  year: '',
  companyName: '',
  companyId: '',
  industry: '',
  participants: '',
  country: '',
  username: '',
  phone: '',
  city: '',
  address: '',
  secondaryEmail: '',
  countryOptional: '',
};

const errorMessages = {
  loginId: 'El usuario o correo es obligatorio',
  password: {
    required: 'La contraseña es obligatoria',
    minLength: 'La contraseña debe tener al menos 6 caracteres',
  },
  confirmPassword: {
    required: 'La confirmación de la contraseña es obligatoria',
    mismatch: 'Las contraseñas no coinciden',
  },
  email: {
    required: 'El correo es obligatorio',
    invalid: 'El correo no es válido',
    exists: 'El correo ya está registrado',
  },
  lastName: 'El apellido es obligatorio',
  firstName: 'El nombre es obligatorio',
  dateOfBirth: {
    required: 'La fecha de nacimiento es obligatoria',
    minAge: 'Debes tener al menos 16 años',
  },
  authFailed: 'Usuario, alias o contraseña incorrectos',
  companyName: 'El nombre de la empresa es obligatorio',
  companyId: 'El código de empresa no existe',
  industry: 'La industria es obligatoria',
  participants: 'La cantidad de empleados es obligatoria',
  country: 'La región es obligatoria',
};

function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const validateForm = useCallback(() => {
    const validationErrors = {};

    if (!isSignUp) {
      if (!formData.loginId) {
        validationErrors.loginId = errorMessages.loginId;
      }
      if (!formData.password) {
        validationErrors.password = errorMessages.password.required;
      } else if (formData.password.length < 6) {
        validationErrors.password = errorMessages.password.minLength;
      }
    }

    return validationErrors;
  }, [formData, isSignUp]);

  const handleSubmit = async (e) => {

    if (e && e.errors) {
      setErrors(e.errors);
      return;
    }

    if (e && (e.skip || e.final)) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = users.some((user) => user.email === formData.email);
      if (emailExists) {
        setErrors({ email: errorMessages.email.exists });
        return;
      }
    
      let companyId = formData.companyId;
      let companyExists = false;
      let companyNameToUse = formData.companyName;
    
      if (companyId) {
        const existingCompany = users.find((user) => user.companyId === companyId);
        if (!existingCompany) {
          setErrors({ companyId: 'El código de empresa no existe' });
          return;
        }
        companyExists = true;
        companyNameToUse = existingCompany.companyName;
      } else {
        const companyNameExists = users.some((user) => user.companyName === formData.companyName);
        if (companyNameExists) {
          setErrors({ companyName: 'La empresa ya está registrada. Usa el código de empresa para unirte.' });
          return;
        }

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        do {
          companyId = '';
          for (let i = 0; i < 10; i++) {
            companyId += characters.charAt(Math.floor(Math.random() * characters.length));
          }
        } while (users.some((user) => user.companyId === companyId));
      }
    
      try {
        const hashedPassword = await bcrypt.hash(formData.password, 10);
        const newUser = {
          email: formData.email,
          username: formData.username,
          password: hashedPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.day && formData.month && formData.year
            ? `${formData.year}-${formData.month}-${formData.day}`
            : '',
          companyName: companyNameToUse,
          companyId: companyId,
          industry: companyExists ? users.find((user) => user.companyId === companyId).industry : formData.industry || '',
          participants: companyExists ? users.find((user) => user.companyId === companyId).participants : formData.participants || '',
          country: companyExists ? users.find((user) => user.companyId === companyId).country : formData.country || '',
          phone: formData.phone || '',
          city: formData.city || '',
          address: formData.address || '',
          secondaryEmail: formData.secondaryEmail || '',
          countryOptional: formData.countryOptional || '',
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        setSuccessMessage(
          companyExists
            ? '¡Cuenta creada con éxito! Te has unido a la empresa.'
            : `¡Cuenta creada con éxito! El código de tu empresa es: ${companyId}`
        );
        setFormData(initialFormData);
        setErrors({});
        setShowPassword(false);
        setTimeout(() => {
          setSuccessMessage('');
          toggleForm();
        }, 5000);
      } catch (error) {
        console.error('Error al hashear la contraseña:', error);
        setErrors({ auth: 'Error al crear la cuenta' });
      }
    } else {
      // Inicio de sesión
      e.preventDefault();
    
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u) => u.email === formData.loginId || (u.username && u.username === formData.loginId));
      if (!user) {
        setErrors({ auth: errorMessages.authFailed });
        return;
      }
    
      try {
        const match = await bcrypt.compare(formData.password, user.password);
        if (!match) {
          setErrors({ auth: errorMessages.authFailed });
          return;
        }
    
        setSuccessMessage('¡Inicio de sesión exitoso!');
        setFormData(initialFormData);
        setErrors({});
        setShowPassword(false);
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/dashboard');
        }, 1000);
      } catch (error) {
        console.error('Error al verificar la contraseña:', error);
        setErrors({ auth: 'Error al iniciar sesión' });
      }
    }
  };

  // Alternar entre formulario de registro e inicio de sesión
  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setFormData(initialFormData);
    setErrors({});
    setShowPassword(false);
    setSuccessMessage('');
  };

  // Mostrar u ocultar la contraseña
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="container">
      <div className="logo">
        <h1>CUENTA UP STRATEGY</h1>
      </div>
      <h2>{isSignUp ? 'CREAR CUENTA' : 'INICIAR SESIÓN'}</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      {errors.auth && <p className="error">{errors.auth}</p>}
      <form onSubmit={handleSubmit}>
        {isSignUp ? (
          <SignUpForm
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            onSubmit={handleSubmit}
          />
        ) : (
          <LoginForm
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        )}
        {!isSignUp && (
          <>
            <button type="submit" className="submit-btn">
              INICIAR SESIÓN
            </button>
            <div className="divider">
              <span>O</span>
            </div>
            <button type="button" className="connect-btn">
              <FaGoogle style={{ paddingLeft: '20px', paddingRight: '20px'}} />
            </button>
          </>
        )}
        <p className="toggle-link" onClick={toggleForm}>
          {isSignUp ? '¿Ya tienes una cuenta?' : '¿Deseas registrarte?'}{' '}
          <a href="#">{isSignUp ? 'Inicia sesión' : 'Crea una cuenta'}</a>
        </p>
      </form>
    </div>
  );
}

export default App;