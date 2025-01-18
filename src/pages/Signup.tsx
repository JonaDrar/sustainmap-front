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
    <div className="gradient-background flex items-center justify-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="bg-white shadow-md rounded-xxl p-8 w-full max-w-md login-card">
        <div className="mb-6 text-center">
          <img
            src="/images/logo-mot.png"
            alt="Matter of Trust Logo"
            className="mx-auto login-logo"
          />
          <h2 className="login-header">Iniciar sesión</h2>
          <p className="text-sm text-gray-700 login-sub-header">Bienvenido/a<br /> Ingresa tus datos para comenzar.</p>
        </div>

        <form className="login-form" onSubmit={handleSignup}>

          <div>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
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
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
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
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
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
        <p className="mt-4 text-center text-md text-gray-400">
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
