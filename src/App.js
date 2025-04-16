import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
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
  companyDomain: '',
  industry: '',
  participants: '',
  country: '',
  username: '',
  phone: '',
  city: '',
  address: '',
  secondaryEmail: '',
  countryOptional: '',
  usesGenericEmail: false,
  status: 'approved',
};

const errorMessages = {
  loginId: 'El usuario o correo es obligatorio',
  password: {
    required: 'La contraseña es obligatoria',
    minLength: 'La contraseña debe tener al menos 8 caracteres',
  },
  confirmPassword: {
    required: 'La confirmación de la contraseña es obligatoria',
    mismatch: 'Las contraseñas no coinciden',
  },
  email: {
    required: 'El correo es obligatorio',
    invalid: 'El correo no es válido',
    exists: 'El correo ya está registrado',
    domainMismatch: 'El correo debe pertenecer al dominio de la empresa',
  },
  lastName: 'El apellido es obligatorio',
  firstName: 'El nombre es obligatorio',
  dateOfBirth: {
    required: 'La fecha de nacimiento es obligatoria',
    minAge: 'Debes tener al menos 18 años',
  },
  authFailed: {
    default: 'Usuario, alias o contraseña incorrectos',
    pending: 'Tu registro está pendiente de aprobación. Por favor, espera la revisión de un administrador.',
  },
  companyName: 'El nombre de la empresa es obligatorio',
  companyId: 'El código de la empresa no existe',
  companyDomain: {
    required: 'El dominio de la empresa es obligatorio',
    invalid: 'El dominio no es válido (ej. empresa.com)',
  },
  industry: 'La industria es obligatoria',
  participants: 'La cantidad de participantes es obligatoria',
  country: 'El pais es obligatorio',
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
      } else if (formData.password.length < 8) {
        validationErrors.password = errorMessages.password.minLength;
      }
    }
    return validationErrors;
  }, [formData, isSignUp]);

  const generateCompanyId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let companyId;
    do {
      companyId = '';
      for (let i = 0; i < 10; i++) {
        companyId += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    } while (JSON.parse(localStorage.getItem('users') || '[]').some((user) => user.companyId === companyId));
    return companyId;
  };

  const createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return {
      ...userData,
      password: hashedPassword,
      status: userData.usesGenericEmail ? 'pending' : 'approved',
    };
  };

  const handleSubmit = async (e) => {
    if (e && e.errors) {
      setErrors(e.errors);
      return;
    }

    if (e && (e.skip || e.final)) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((user) => user.email === formData.email)) {
        setErrors({ email: errorMessages.email.exists });
        return;
      }

      let companyId = formData.companyId;
      let companyExists = false;
      let companyNameToUse = formData.companyName;
      const isPending = formData.usesGenericEmail;

      if (companyId) {
        const existingCompany = users.find((user) => user.companyId === companyId);
        if (!existingCompany) {
          setErrors({ companyId: errorMessages.companyId });
          return;
        }
        
        if (existingCompany.status === 'pending') {
          setErrors({ companyId: 'La empresa asociada a este código está pendiente de aprobación. No puedes unirte hasta que sea aprobada.' });
          return;
        }
        companyExists = true;
        companyNameToUse = existingCompany.companyName;
      } else {
        if (users.some((user) => user.companyName === formData.companyName)) {
          setErrors({ companyName: 'La empresa ya está registrada. Usa el código de empresa para unirte.' });
          return;
        }
        
        if (!isPending) {
          companyId = generateCompanyId();
        }
      }

      if (!formData.usesGenericEmail && formData.companyDomain) {
        const emailDomain = formData.email.split('@')[1]?.toLowerCase();
        const companyDomain = formData.companyDomain.toLowerCase();
        if (emailDomain !== companyDomain) {
          setErrors({ email: errorMessages.email.domainMismatch });
          return;
        }
      }

      try {
        const newUser = await createUser({
          ...formData,
          companyId,
          companyName: companyNameToUse,
          companyDomain: formData.companyDomain || '',
          industry: companyExists ? users.find((user) => user.companyId === companyId).industry : formData.industry || '',
          participants: companyExists ? users.find((user) => user.companyId === companyId).participants : formData.participants || '',
          country: companyExists ? users.find((user) => user.companyId === companyId).country : formData.country || '',
          phone: formData.phone || '',
          city: formData.city || '',
          address: formData.address || '',
          secondaryEmail: formData.secondaryEmail || '',
          countryOptional: formData.countryOptional || '',
        });

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        if (newUser.status === 'pending') {
          setSuccessMessage('Tu registro está pendiente de aprobación. Un administrador revisará tu solicitud pronto.');
        } else {
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
            setIsSignUp(false);
          }, 5000);
        }
      } catch (error) {
        console.error('Error al hashear la contraseña:', error);
        setErrors({ auth: 'Error al crear la cuenta' });
      }
    } else {
      e.preventDefault();
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u) => u.email === formData.loginId || (u.username && u.username === formData.loginId));
      if (!user) {
        setErrors({ auth: errorMessages.authFailed.default });
        return;
      }

      if (user.status === 'pending') {
        setErrors({ auth: errorMessages.authFailed.pending });
        return;
      }

      try {
        const match = await bcrypt.compare(formData.password, user.password);
        if (!match) {
          setErrors({ auth: errorMessages.authFailed.default });
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
        <h1>UP STRATEGY</h1>
      </div>
      <h2>{isSignUp ? 'CREAR CUENTA' : 'INICIAR SESIÓN'}</h2>
      {successMessage && <p className={successMessage.includes('pendiente') ? 'error' : 'success'}>{successMessage}</p>}
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
            onSubmit={handleSubmit}
            toggleForm={toggleForm}
          />
        )}
      </form>
      <p className="toggle-link" onClick={toggleForm}>
        {isSignUp ? '¿Ya tienes una cuenta?' : '¿Deseas registrarte?'}{' '}
        <a href="#">{isSignUp ? 'Inicia sesión' : 'Crea una cuenta'}</a>
      </p>
    </div>
  );
}

export default App;