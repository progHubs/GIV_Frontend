import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { loginSchema } from '../../../lib/validationSchemas';
import type { LoginFormData } from '../../../lib/validationSchemas';
import { ThemeProvider } from '../../../theme';
import LoadingLink from '../../../components/common/LoadingLink';

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Get the intended destination from location state
  const from = (location.state as any)?.from?.pathname || '/';

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data);

      // Login successful - redirect to intended destination
      navigate(from, { replace: true });
    } catch (error: any) {
      // Handle specific backend errors
      if (error.code === 'INVALID_CREDENTIALS') {
        setError('email', {
          type: 'manual',
          message: 'Invalid email or password',
        });
        setError('password', {
          type: 'manual',
          message: 'Invalid email or password',
        });
      } else if (error.code === 'ACCOUNT_LOCKED') {
        // Show account locked message with unlock time if available
        const unlockTime = error.details?.lockoutUntil
          ? new Date(error.details.lockoutUntil).toLocaleTimeString()
          : '';
        setError('email', {
          type: 'manual',
          message: unlockTime
            ? `Account locked until ${unlockTime}`
            : 'Account temporarily locked due to multiple failed attempts',
        });
      } else if (error.code === 'EMAIL_NOT_VERIFIED') {
        setError('email', {
          type: 'manual',
          message: 'Please verify your email address before logging in',
        });
      } else if (error.code === 'VALIDATION_ERROR' && error.details) {
        // Map backend validation errors to form fields
        Object.entries(error.details).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(field as keyof LoginFormData, {
              type: 'manual',
              message: messages[0],
            });
          }
        });
      }
      // Other errors will be displayed via the auth context error state
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center bg-theme-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div
              onClick={() => (window.location.href = '/')}
              className="mx-auto h-12 w-12 bg-theme-primary rounded-lg flex items-center justify-center cursor-pointer"
            >
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-theme-primary">
              {t('auth.login.title')}
            </h2>
            <p className="mt-2 text-center text-sm text-theme-muted">{t('auth.login.subtitle')}</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Global error message */}
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-theme-primary">
                  {t('auth.login.email')}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300 dark:border-red-500' : 'border-theme'
                  } placeholder-theme-muted text-theme-primary bg-theme-surface rounded-md focus:outline-none focus:ring-theme-primary focus:border-theme-primary focus:z-10 sm:text-sm`}
                  placeholder={t('auth.login.email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-theme-primary">
                  {t('auth.login.password')}
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                      errors.password ? 'border-red-300 dark:border-red-500' : 'border-theme'
                    } placeholder-theme-muted text-theme-primary bg-theme-surface rounded-md focus:outline-none focus:ring-theme-primary focus:border-theme-primary focus:z-10 sm:text-sm`}
                    placeholder={t('auth.login.password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="text-theme-muted text-sm">
                      {showPassword ? 'Hide' : 'Show'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-theme-primary focus:ring-theme-primary border-theme rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-theme-primary">
                  {t('auth.login.remember')}
                </label>
              </div>

              <div className="text-sm">
                <LoadingLink
                  to="/forgot-password"
                  className="font-medium text-theme-primary hover:text-theme-brand-primary"
                >
                  {t('auth.login.forgot')}
                </LoadingLink>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-theme-primary hover:bg-theme-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  t('auth.login.submit')
                )}
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-sm text-theme-muted">
                {t('auth.login.noAccount')}{' '}
                <LoadingLink
                  to="/register"
                  className="font-medium text-theme-primary hover:text-theme-brand-primary"
                >
                  {t('auth.login.signUp')}
                </LoadingLink>
              </span>
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LoginForm;
