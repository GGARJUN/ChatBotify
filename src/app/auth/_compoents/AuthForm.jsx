'use client';

import { useState } from 'react';
import Link from 'next/link';

export const AuthForm = ({ type, onSubmit, loading }) => {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    ...(type === 'register' && {
      firstName: '',
      lastName: '',
      organization: ''
    })
  });
  const [errFields, setErrFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errFields[name]) {
      setErrFields(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const errors = {};
    if (!formValues.email) errors.email = 'Email is required';
    if (!formValues.password) errors.password = 'Password is required';
    
    if (Object.keys(errors).length > 0) {
      setErrFields(errors);
      return;
    }
    
    onSubmit(formValues);
  };

  return (
    <div className="flex flex-col gap-4 max-w-[413px] mx-auto">
      {type === 'login' && (
        <div className="relative">
          <p className="relative bg-white w-fit mx-auto px-2 text-gray-600 text-xs">or</p>
          <span className="absolute left-0 top-[70%] w-full h-[1px] bg-[#eae6e7]"></span>
        </div>
      )}
      
      {type === 'register' && (
        <div className="text-left">
          <label htmlFor="firstName" className="text-sm font-medium mb-1 block">
            First Name
          </label>
          <input
            id="firstName"
            placeholder="e.g. Eleanor"
            value={formValues.firstName}
            name="firstName"
            onChange={handleChange}
            className={`w-full border border-[#eae6e7] rounded-[10px] min-h-[52px] px-6 py-3.5 text-base outline-none transition-all duration-300 hover:border-[#7856ff] ${
              errFields.firstName ? 'border-red-500 border-2' : ''
            }`}
          />
          {errFields.firstName && <small className="text-red-600 font-bold text-sm">{errFields.firstName}</small>}
        </div>
      )}
      {type === 'register' && (
        <div className="text-left">
          <label htmlFor="lastName" className="text-sm font-medium mb-1 block">
            Last Name
          </label>
          <input
            id="lastName"
            placeholder="e.g. Eleanor"
            value={formValues.lastName}
            name="lastName"
            onChange={handleChange}
            className={`w-full border border-[#eae6e7] rounded-[10px] min-h-[52px] px-6 py-3.5 text-base outline-none transition-all duration-300 hover:border-[#7856ff] ${
              errFields.lastName ? 'border-red-500 border-2' : ''
            }`}
          />
          {errFields.lastName && <small className="text-red-600 font-bold text-sm">{errFields.lastName}</small>}
        </div>
      )}

      <div className="text-left">
        <label htmlFor="email" className="text-sm font-medium mb-1 block">
          Email
        </label>
        <input
          id="email"
          placeholder="e.g. eleanor@mixpixel.com"
          value={formValues.email}
          name="email"
          onChange={handleChange}
          className={`w-full border border-[#eae6e7] rounded-[10px] min-h-[52px] px-6 py-3.5 text-base outline-none transition-all duration-300 hover:border-[#7856ff] ${
            errFields.email ? 'border-red-500 border-2' : ''
          }`}
        />
        {errFields.email && <small className="text-red-600 font-bold text-sm">{errFields.email}</small>}
      </div>

      <div className="text-left">
        <label htmlFor="password" className="text-sm font-medium mb-1 block">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Example@123"
          value={formValues.password}
          name="password"
          onChange={handleChange}
          className={`w-full border border-[#eae6e7] rounded-lg min-h-[52px] px-6 py-3.5 text-base outline-none transition-all duration-300 hover:border-[#7856ff] ${
            errFields.password ? 'border-red-500 border-2' : ''
          }`}
        />
        {errFields.password && <small className="text-red-600 font-bold text-sm">{errFields.password}</small>}
      </div>

      {type === 'register' && (
        <div className="text-left">
          <label htmlFor="firstName" className="text-sm font-medium mb-1 block">
            Organization
          </label>
          <input
            id="organization"
            placeholder="e.g. Eleanor"
            value={formValues.organization}
            name="organization"
            onChange={handleChange}
            className={`w-full border border-[#eae6e7] rounded-[10px] min-h-[52px] px-6 py-3.5 text-base outline-none transition-all duration-300 hover:border-[#7856ff] ${
              errFields.organization ? 'border-red-500 border-2' : ''
            }`}
          />
          {errFields.organization && <small className="text-red-600 font-bold text-sm">{errFields.organization}</small>}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`text-white mt-2 text-lg bg-[#7856ff] bg-gradient-to-t from-[#7856ff] to-[#9075ff] shadow-[inset_0_-1px_0_#5028c0,inset_0_1px_0_rgba(255,255,255,0.2)] font-medium h-[43px] rounded-[96px] transition-all duration-300 hover:rounded-md border-none outline-none ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? `${type === 'login' ? 'Logging in...' : 'Registering...'}` : type === 'login' ? 'Login' : 'Register'}
      </button>

      <p className="text-sm font-normal leading-relaxed text-[#1b0b3b] text-center mt-2">
        {type === 'login' ? (
          <>
            Don't have an account?{' '}
            <Link href="/register" className="text-[#5028c0] no-underline hover:underline transition-all duration-300">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="text-[#5028c0] no-underline hover:underline transition-all duration-300">
              Sign In
            </Link>
          </>
        )}
      </p>
    </div>
  );
};