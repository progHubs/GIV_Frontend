import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { loginSchema } from '../../../lib/validationSchemas';
import type { LoginFormData } from '../../../lib/validationSchemas';

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Get the intended destination from location state
  const from = (location.state as any)?.from?.pathname || '/dashboard';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">{t('auth.login.subtitle')}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Global error message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.login.email')}
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder={t('auth.login.email')}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.login.password')}
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder={t('auth.login.password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 text-sm">{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                {t('auth.login.remember')}
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                {t('auth.login.forgot')}
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <span className="text-sm text-gray-600">
              {t('auth.login.noAccount')}{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                {t('auth.login.signUp')}
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
