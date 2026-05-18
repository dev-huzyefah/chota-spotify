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
  displayName: Yup.string()
    .required('Display name is required')
    .min(2, 'Display name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export function SignupForm() {
  const { signup, isAuthenticated, error, clearError, isLoading } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      // Clear error after showing toast to prevent re-triggering if component re-mounts
      // or to allow showing the same error again if the user submits again
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

        <h1 className="auth-card__title">Start listening</h1>
        <p className="auth-card__subtitle">Create your account to get started</p>

        <Formik
          initialValues={{
            displayName: '',
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            clearError();
            await signup(values);
          }}
        >
          {({ isValid, dirty }) => (
            <Form className="auth-form" id="signup-form">
              <FormInput
                label="Display Name"
                name="displayName"
                type="text"
                placeholder="What should we call you?"
                autoComplete="name"
                id="signup-name"
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                id="signup-email"
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                autoComplete="new-password"
                id="signup-password"
              />

              <button 
                type="submit" 
                className="auth-form__submit" 
                id="signup-submit"
                disabled={isLoading || !isValid || !dirty}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="auth-card__footer">
          Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}


