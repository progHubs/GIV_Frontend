import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePassword, getPasswordStrength } from '../../../utils/validation';

const ResetPasswordPage: React.FC = () => {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const { token: tokenFromUrl } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [resetSuccess, setResetSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(''));

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (!tokenFromUrl) {
      // Redirect to forgot password if no token
      navigate('/forgot-password');
      return;
    }
    setToken(tokenFromUrl);
  }, [tokenFromUrl, navigate]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Password validation
    if (!formData.newPassword || formData.newPassword.trim() === '') {
      errors.newPassword = 'New password is required';
    } else {
      const passwordValidation = validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        errors.newPassword = passwordValidation.errors[0];
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword || formData.confirmPassword.trim() === '') {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!token) {
      console.log('No token available');
      return;
    }

    console.log('Form data before validation:', formData);
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    console.log('Form validation passed');

    try {
      await resetPassword({
        token,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });
      setResetSuccess(true);
    } catch (error) {
      // Error is handled by the auth context
      console.error('Reset password error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update password strength for new password
    if (name === 'newPassword') {
      setPasswordStrength(getPasswordStrength(value));
    }

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Password reset successful!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Security actions completed:
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>All existing sessions have been terminated</li>
                      <li>All access tokens have been revoked</li>
                      <li>Security notification sent to your email</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Link
                to="/login"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Invalid reset link</h2>
            <p className="mt-2 text-sm text-gray-600">
              The password reset link is invalid or has expired.
            </p>
            <div className="mt-4">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium">
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <span className="text-2xl font-bold text-blue-600">G</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter your new password below.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password *
              </label>
              <div className="mt-1 relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                    validationErrors.newPassword || error
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  } rounded-md focus:z-10 sm:text-sm`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600 text-sm">
                    {showPassword ? 'Hide' : 'Show'}
                  </span>
                </button>
              </div>
              {validationErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
              )}

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Password strength</span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.level === 'Very Weak'
                          ? 'text-red-600'
                          : passwordStrength.level === 'Weak'
                            ? 'text-red-500'
                            : passwordStrength.level === 'Fair'
                              ? 'text-yellow-600'
                              : passwordStrength.level === 'Good'
                                ? 'text-blue-600'
                                : passwordStrength.level === 'Strong'
                                  ? 'text-green-600'
                                  : 'text-green-700'
                      }`}
                    >
                      {passwordStrength.level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score < 20
                          ? 'bg-red-600'
                          : passwordStrength.score < 40
                            ? 'bg-red-500'
                            : passwordStrength.score < 60
                              ? 'bg-yellow-500'
                              : passwordStrength.score < 80
                                ? 'bg-blue-500'
                                : passwordStrength.score < 95
                                  ? 'bg-green-500'
                                  : 'bg-green-600'
                      }`}
                      style={{ width: `${passwordStrength.score}%` }}
                    ></div>
                  </div>
                  {passwordStrength.suggestions.length > 0 && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-600">
                        Suggestions: {passwordStrength.suggestions.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password *
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                    validationErrors.confirmPassword || error
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  } rounded-md focus:z-10 sm:text-sm`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600 text-sm">
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </span>
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Resetting password...
                </>
              ) : (
                'Reset password'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
