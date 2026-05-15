import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/shared/components/Toast/ToastContext';
import { ROUTES } from '@/shared/constants';
import { FormInput } from './FormInput';
import './Auth.css';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

export function LoginForm() {
  const { login, isAuthenticated, error, clearError, isLoading } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      clearError();
    }
  }, [error, showToast, clearError]);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <div className="auth-card__logo-icon">
            <img src="/spotify.svg" alt="Spotify" />
          </div>
          <span className="auth-card__logo-text">Spotify</span>
        </div>

        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Sign in</p>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            clearError();
            await login(values);
          }}
        >
          {({ isValid, dirty }) => (
            <Form className="auth-form" id="login-form">
              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                id="login-email"
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                id="login-password"
              />

              <button 
                type="submit" 
                className="auth-form__submit" 
                id="login-submit"
                disabled={isLoading || !isValid || !dirty}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="auth-card__footer">
          Don't have an account? <Link to={ROUTES.SIGNUP}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
