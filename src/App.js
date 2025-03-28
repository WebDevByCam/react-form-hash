import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PasswordInput from './components/PasswordInput';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import './App.css';
import bcrypt from 'bcryptjs'; // Importar bcryptjs

const initialFormData = {
  loginId: '',
  email: '',
  password: '',
  lastName: '',
  firstName: '',
  day: '',
  month: '',
  year: '',
};

const errorMessages = {
  loginId: 'Login ID is required',
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 6 characters',
  },
  email: {
    required: 'Email is required',
    invalid: 'Email is invalid',
    exists: 'Email is already registered',
  },
  lastName: 'Last Name is required',
  firstName: 'First Name is required',
  dateOfBirth: {
    required: 'Date of Birth is required',
    minAge: 'You must be at least 16 years old',
  },
  authFailed: 'Invalid email or password',
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
    } else {
      if (!formData.email) {
        validationErrors.email = errorMessages.email.required;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        validationErrors.email = errorMessages.email.invalid;
      }
      if (!formData.password) {
        validationErrors.password = errorMessages.password.required;
      } else if (formData.password.length < 6) {
        validationErrors.password = errorMessages.password.minLength;
      }
      if (!formData.lastName) {
        validationErrors.lastName = errorMessages.lastName;
      }
      if (!formData.firstName) {
        validationErrors.firstName = errorMessages.firstName;
      }
      if (!formData.day || !formData.month || !formData.year) {
        validationErrors.dateOfBirth = errorMessages.dateOfBirth.required;
      } else {
        const birthDate = new Date(`${formData.year}-${formData.month}-${formData.day}`);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 16) {
          validationErrors.dateOfBirth = errorMessages.dateOfBirth.minAge;
        }
      }
    }

    return validationErrors;
  }, [formData, isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isSignUp) {
      // Registro
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = users.some((user) => user.email === formData.email);
      if (emailExists) {
        setErrors({ email: errorMessages.email.exists });
        return;
      }

      try {
        // Hashear la contraseña con bcrypt
        const hashedPassword = await bcrypt.hash(formData.password, 10); // Factor de trabajo: 10

        const newUser = {
          email: formData.email,
          password: hashedPassword, // Almacenar la contraseña hasheada
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: `${formData.year}-${formData.month}-${formData.day}`,
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        setSuccessMessage('Account created successfully!');
        setFormData(initialFormData);
        setErrors({});
        setShowPassword(false);
        setTimeout(() => {
          setSuccessMessage('');
          toggleForm();
        }, 2000);
      } catch (error) {
        console.error('Error al hashear la contraseña:', error);
        setErrors({ auth: 'Error creating account' });
      }
    } else {
      // Login
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u) => u.email === formData.loginId);
      if (!user) {
        setErrors({ auth: errorMessages.authFailed });
        return;
      }

      try {
        // Comparar la contraseña ingresada con el hash almacenado
        const match = await bcrypt.compare(formData.password, user.password);
        if (!match) {
          setErrors({ auth: errorMessages.authFailed });
          return;
        }

        setSuccessMessage('Logged in successfully!');
        setFormData(initialFormData);
        setErrors({});
        setShowPassword(false);
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/dashboard');
        }, 1000);
      } catch (error) {
        console.error('Error al verificar la contraseña:', error);
        setErrors({ auth: 'Error logging in' });
      }
    }
  };

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setFormData(initialFormData);
    setErrors({});
    setShowPassword(false);
    setSuccessMessage('');
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="container">
      <div className="logo">
        <h1>UP STRATEGY ACCOUNT</h1>
      </div>
      <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
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
        <button type="submit" className="submit-btn">
          {isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}
        </button>
        <p className="toggle-link" onClick={toggleForm}>
          {isSignUp ? 'Already have an Account?' : 'Would you like to Sign Up?'}{' '}
          <a href="#">{isSignUp ? 'Sign In' : 'Create an Account'}</a>
        </p>
      </form>
    </div>
  );
}

export default App;