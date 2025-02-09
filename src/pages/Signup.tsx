import React, { useState } from 'react';
import { register } from '../authentication/auth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';


const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    special: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };


  const validatePassword = (password: string) => {
    const length = password.length >= 8;
    const number = /\d/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordChecks({ length, number, special });
  };

  const showValidationRequirements = password.length;

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: { [key: string]: string } = {};
  
    // Validación del email
    if (!email) {
      validationErrors.email = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Por favor, ingresa un correo válido.';
    }
  
    // Validación de la contraseña
    if (!password) {
      validationErrors.password = 'La contraseña es obligatoria.';
    } else {
      if (password.length < 8) {
        validationErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
      }
      if (password !== confirmPassword) {
        validationErrors.confirmPassword = 'Las contraseñas no coinciden.';
      }
    }
  
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
  
    try {
      await register(email, password);
      alert('¡Registro exitoso!');
      setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setPasswordChecks({ length: false, number: false, special: false });
    } catch (error) {
      console.error('Error de registro:', error);
      const firebaseError = error as { code?: string };
  
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          setErrors({ email: 'Este correo electrónico ya está en uso.' });
          break;
        case 'auth/invalid-email':
          setErrors({ email: 'El correo electrónico no es válido.' });
          break;
        case 'auth/weak-password':
          setErrors({ password: 'La contraseña debe tener al menos 8 caracteres.' });
          break;
        default:
          setErrors({ general: 'Hubo un problema al registrar el usuario.' });
          break;
      }
    }
  };


  
  const isValidInput =
  email.length > 0 &&
  password.length > 0 &&
  confirmPassword.length > 0 

  return (
    <div className="gradient-background flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="bg-white shadow-md rounded-xxl px-6 py-8 w-full max-w-xs sm:max-w-sm md:max-w-md login-card">
        <div className="mb-6 text-center">
          <img
            src="images/logo-mott_int.png"
            alt="Matter of Trust Logo"
            className="w-32 sm:w-57 md:w-61 lg:w-64 h-auto mx-auto mb-6 login-logo"
          />
          <h2 className="text-lg md:text-2xl font-bold text-blue-700 login-header">Crear Cuenta de Usuario</h2>
          <p className="text-sm text-gray-700 login-sub-header-2">Ingresa los datos del usuario</p>
        </div>

        <form className="space-y-2 login-form" onSubmit={handleSignup}>

          <div>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-md"
            />
            {errors.email && <p className="error-text text-sm">{errors.email}</p>}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text": "password"}
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              className="w-full px-4 py-2 text-sm border rounded-md"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 mb-4 flex items-center pr-3 focus:outline-none"
            >
              {showPassword ? (
                <EyeIcon className=" h-5 text-gray-500" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          <div>
            {errors.password && <p className="error-text">{errors.password}</p>}
            {errors.general && <p>{errors.general}</p>}
            {showValidationRequirements ? (<div className="password-tooltip">
              <ul>
                <li style={{ color: passwordChecks.length ? 'green' : 'red' }}>
                  {passwordChecks.length ? '✔️' : '❌'} Al menos 8 caracteres
                </li>
                <li style={{ color: passwordChecks.number ? 'green' : 'red' }}>
                  {passwordChecks.number ? '✔️' : '❌'} Incluye un número
                </li>
                <li style={{ color: passwordChecks.special ? 'green' : 'red' }}>
                  {passwordChecks.special ? '✔️' : '❌'} Incluye un carácter especial
                </li>
              </ul>
            </div>
            ) : null}

          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-md"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 mb-4 flex items-center pr-3 focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeIcon className=" h-5 text-gray-500" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {errors.confirmPassword && <p className="error-text text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValidInput}
            className={`submit-button w-full flex justify-center py-2 px-4 border border-transparent transition-colors duration-300 focus:outline-none ${isValidInput
                ? "bg-[var(--Azul-activado,#146FB7)] cursor-not-allowed text-white"
                : "bg-[var(--Azul-desactivado,#E1F4FE)] text-gray-700"
              }`}           >
            Registrarse
          </button>
        </form>

      </div>

    </div >
  );
};

export default Signup;

