import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Button from '@/components/ui/Button';
import type { RegisterData } from '@/types';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'forms', 'errors']);
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterData>({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'user',
    is_donor: false,
    is_volunteer: false,
    language_preference: 'en',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.password_confirmation) {
      // Handle password mismatch error
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth context
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth:createAccount')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">{t('auth:getStarted')}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="full_name" className="form-label">
                {t('auth:fullName')}
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                className="form-input"
                placeholder={t('auth:fullName')}
                value={formData.full_name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                {t('auth:email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder={t('auth:email')}
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="form-label">
                {t('auth:phoneNumber')}{' '}
                <span className="text-gray-400">({t('forms:optional')})</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="form-input"
                placeholder={t('auth:phoneNumber')}
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                {t('auth:password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                placeholder={t('auth:password')}
                value={formData.password}
                onChange={handleInputChange}
              />
              <p className="mt-1 text-xs text-gray-500">{t('auth:passwordRequirements')}</p>
            </div>

            <div>
              <label htmlFor="password_confirmation" className="form-label">
                {t('auth:confirmPassword')}
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                placeholder={t('auth:confirmPassword')}
                value={formData.password_confirmation}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="language_preference" className="form-label">
                {t('auth:languagePreference')}
              </label>
              <select
                id="language_preference"
                name="language_preference"
                className="form-input"
                value={formData.language_preference}
                onChange={handleInputChange}
              >
                <option value="en">{t('auth:english')}</option>
                <option value="am">{t('auth:amharic')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="is_donor"
                  name="is_donor"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formData.is_donor}
                  onChange={handleInputChange}
                />
                <label htmlFor="is_donor" className="ml-2 block text-sm text-gray-900">
                  {t('auth:isDonor')}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="is_volunteer"
                  name="is_volunteer"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formData.is_volunteer}
                  onChange={handleInputChange}
                />
                <label htmlFor="is_volunteer" className="ml-2 block text-sm text-gray-900">
                  {t('auth:isVolunteer')}
                </label>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              disabled={
                !formData.full_name ||
                !formData.email ||
                !formData.password ||
                !formData.password_confirmation
              }
              className="w-full"
            >
              {t('auth:signUp')}
            </Button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              {t('auth:alreadyHaveAccount')}{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                {t('auth:signIn')}
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
