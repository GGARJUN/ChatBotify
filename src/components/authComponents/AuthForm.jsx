
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Loader2 } from 'lucide-react';

export const AuthForm = ({ type, onSubmit, loading }) => {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    ...(type === 'register' && {
      firstName: '',
      lastName: '',
      organization: '',
    })
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordScore, setPasswordScore] = useState(0);

  useEffect(() => {
    // Reset errors when form values change
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [formValues]);

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value))
          return 'Password must contain uppercase, lowercase, number and special character';
        return '';
      // case 'confirmPassword':
      //   if (value !== formValues.password) return 'Passwords do not match';
      //   return '';
      case 'firstName':
      case 'lastName':
        if (!value) return 'This field is required';
        if (value.length < 2) return 'Must be at least 2 characters';
        return '';
      case 'organization':
        if (!value) return 'Organization is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formValues).forEach(key => {
      newErrors[key] = validateField(key, formValues[key]);
    });

    setErrors(newErrors);
    setTouched(Object.keys(formValues).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    // Check if any errors exist
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {type === 'register' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-left">
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formValues.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-lg p-3 hover:border-primary transition-all duration-300 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="John"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>
          <div className="text-left">
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formValues.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-lg p-3 hover:border-primary transition-all duration-300 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>
      )}

      <div className="text-left">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full border rounded-lg p-3 hover:border-primary transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="your@email.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="text-left">
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full border rounded-lg p-3 hover:border-primary transition-all duration-300 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="••••••••"
        />
        <PasswordStrengthBar
          password={formValues.password}
          onChangeScore={(score) => setPasswordScore(score)}
          className="mt-2"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Password must contain at least 8 characters, including uppercase, lowercase, number and special character.
        </p>
      </div>

      {type === 'register' && (
        <div className="text-left">
          <label htmlFor="organization" className="block text-sm font-medium mb-1">
            Organization *
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            value={formValues.organization}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded-lg p-3 ${errors.organization ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Your Company"
          />
          {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (type === 'register' && passwordScore < 3)}
        className={`mt-4 w-full py-3 px-4 rounded-lg font-medium text-white cursor-pointer ${loading || (type === 'register' && passwordScore < 3)
            ? 'bg-blue-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors flex items-center justify-center gap-2`}
      >
        {loading ? (
          type === 'login' ? (
            <>
              <span>Logging in</span>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            <>
              <span>Registering</span>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          )
        ) : type === 'login' ? (
          'Log In'
        ) : (
          'Register'
        )}
      </button>

      <div className="text-center text-sm ">
        {type === 'login' ? (
          <>
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </>
        )}
      </div>
    </form>
  );
};