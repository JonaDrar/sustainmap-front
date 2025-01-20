import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    special: false,
  });

  const validatePassword = (password: string) => {
    const length = password.length >= 8;
    const number = /\d/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordChecks({ length, number, special });
  };

  const showValidationRequirements = password.length;

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: { [key: string]: string } = {};

    if (!email) {
      validationErrors.email = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Por favor, ingresa un correo válido.';
    }

    if (!password) {
      validationErrors.password = 'La contraseña es obligatoria.';
    } else {
      if (!passwordChecks.length) validationErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
      if (!passwordChecks.number) validationErrors.password = 'La contraseña debe incluir un número.';
      if (!passwordChecks.special) validationErrors.password = 'La contraseña debe incluir un carácter especial.';
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert('¡Registro exitoso!');
      navigate('/');
    }
  };
  const isValidInput = Boolean(email.length && password.length && confirmPassword.length);
  return (
    <div className="gradient-background flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="bg-white shadow-md rounded-xxl px-6 py-8 w-full max-w-xs sm:max-w-sm md:max-w-md login-card">
        <div className="mb-6 text-center">
          <img
            src="/images/logo-mot.png"
            alt="Matter of Trust Logo"
            className="w-24 sm:w-28 lg:w-36 mx-auto mb-4 login-logo"
          />
          <h2 className=" text-lg md:text-2xl font-bold text-blue-700 login-header">Crear Cuenta </h2>
          <p className="text-sm text-gray-700 login-sub-header-2">Bienvenido/a<br /> Ingresa tus datos para comenzar.</p>
        </div>

        <form className=" space-y-2 login-form" onSubmit={handleSignup}>

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
          <div>
            <input
              type="password"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              className="w-full px-4 py-2 text-sm border rounded-md"
            />
            {errors.password && <p className="error-text text-sm">{errors.password}</p>}
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
          <div>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-md"
            />
            {errors.confirmPassword && <p className="error-text text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValidInput}
            className={`submit-button w-full flex justify-center py-2 px-4 border border-transparent transition-colors duration-300 focus:outline-none ${
              isValidInput
                ? "bg-[var(--Azul-activado,#146FB7)] cursor-not-allowed text-white"
                : "bg-[var(--Azul-desactivado,#E1F4FE)] text-gray-700"
            }`}           >
            Registrarse
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes una cuenta?
          {' '}
          <Link to="/" 
            className="font-medium text-gray-700 hover:text-gray-500 ml-1"
            >
            Inicia sesión
          </Link>
        </p>
      </div>

    </div >
  );
};

export default Signup;
