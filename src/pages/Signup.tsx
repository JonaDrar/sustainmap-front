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

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

      <div className="mb-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Regístrate
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 mt-5">
          ¿Ya tienes una cuenta?
          {' '}
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión
          </Link>
        </p>
      </div>


      <form onSubmit={handleSignup}>
        <div className="form-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="form-field">
          <label>Contraseña</label>
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
        <div className="form-field">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="submit-button">
          Registrarse
        </button>
      </form>
    </div>

  </div>
  );
};

export default Signup;
