import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { api } from '../../api/instance';
import './AuthForm.scss';

interface AuthFormProps {
  onSuccess: (name: string) => void;
}

type AuthView = 'login' | 'register' | 'success';

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
  });

  const resetFormData = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setErrors({ email: false, password: false, confirmPassword: false, firstName: false, lastName: false });
  };

  const validateForm = () => {
    const newErrors = {
      email: !email,
      password: !password,
      firstName: view === 'register' ? !firstName : false,
      lastName: view === 'register' ? !lastName : false,
      confirmPassword: view === 'register' ? (!confirmPassword || confirmPassword !== password) : false,
    };
    setErrors(newErrors);
    const isValid = !Object.values(newErrors).some(Boolean);
    return isValid;
  };

  const loginUser = async () => {
    await api.post('/auth/login', { email, password });
    const profileRes = await api.get('/profile');
    onSuccess(profileRes.data.name);
  };

  const registerUser = async () => {
    await api.post('/user', {
      email,
      password,
      name: firstName,
      surname: lastName
    });
    setView('success');
  };

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
    setErrors(prev => ({ ...prev, firstName: false }));
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
    setErrors(prev => ({ ...prev, lastName: false }));
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrors(prev => ({ ...prev, password: false }));
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setErrors(prev => ({ ...prev, confirmPassword: false }));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrors(prev => ({ ...prev, email: false }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      view === 'login' ? await loginUser() : await registerUser();
    } catch (error: any) {
      alert(error.response?.data?.message || "Произошла ошибка");
    }
  };

  const toggleAuthMode = () => {
    setView(view === 'login' ? 'register' : 'login');
    resetFormData();
  };

  if (view === 'success') {
    return (
      <div className="auth-container success-view">
        <img className="auth-logo" src="/marusia-black-icon.svg" alt="Маруся" />
        <h2 className="success-title">Регистрация завершена</h2>
        <p className="success-text">Используйте вашу электронную почту для входа</p>

        <button
          className="login-submit-btn"
          onClick={() => setView('login')}>
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <img className="auth-logo" src="/marusia-black-icon.svg" alt="Маруся" />

      {view === 'register' && (
        <>
          <h2 className="auth-header">Регистрация</h2>
        </>
      )}

      <form className="auth-fields" onSubmit={handleSubmit}>
        <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
          <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V15H8ZM5 10V12H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z" fill="currentColor" />
          </svg>

          <input
            type="email"
            placeholder="Электронная почта"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        {view === 'register' && (
          <>
            <div className={`input-wrapper ${errors.firstName ? 'error' : ''}`}>
              <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" fill="currentColor" />
              </svg>
              <input
                type="text"
                placeholder="Имя"
                value={firstName}
                onChange={handleFirstNameChange}
              />
            </div>
            <div className={`input-wrapper ${errors.lastName ? 'error' : ''}`}>
              <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" fill="currentColor" />
              </svg>
              <input
                type="text"
                placeholder="Фамилия"
                value={lastName}
                onChange={handleLastNameChange}
              />
            </div>
          </>
        )}

        <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
          <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.917 13C12.441 15.8377 9.973 18 7 18C3.68629 18 1 15.3137 1 12C1 8.68629 3.68629 6 7 6C9.973 6 12.441 8.16229 12.917 11H23V13H21V17H19V13H17V17H15V13H12.917ZM7 16C9.20914 16 11 14.2091 11 12C11 9.79086 9.20914 8 7 8C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16Z" fill="currentColor" />
          </svg>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        {view === 'register' && (
          <>
            <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
              <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.917 13C12.441 15.8377 9.973 18 7 18C3.68629 18 1 15.3137 1 12C1 8.68629 3.68629 6 7 6C9.973 6 12.441 8.16229 12.917 11H23V13H21V17H19V13H17V17H15V13H12.917ZM7 16C9.20914 16 11 14.2091 11 12C11 9.79086 9.20914 8 7 8C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16Z" fill="currentColor" />
              </svg>
              <input
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
          </>
        )}

        <button className="login-submit-btn" type="submit">
          {view === 'login' ? 'Войти' : 'Создать аккаунт'}
        </button>

        <button type="button" className="register-link-btn" onClick={toggleAuthMode}>
          {view === 'login' ? 'Регистрация' : 'У меня есть аккаунт'}
        </button>

      </form>
    </div>
  );
};

export default AuthForm;