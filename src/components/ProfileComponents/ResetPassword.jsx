"use client"
import { useAuth } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { FaKey } from 'react-icons/fa';

function ResetPassword() {
  const [formValues, setFormValues] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { forgotPassword, loading } = useAuth();

  const validateField = (name, value) => {
    if (name === 'email') {
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
      return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { email: validateField('email', formValues.email) };
    setErrors(newErrors);
    setTouched({ email: true });

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    try {
      await forgotPassword(formValues.email);
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [formValues]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-10">
      <h3 className='font-bold text-xl text-primary flex items-center gap-2'>
        <FaKey />
        ResetPassword
      </h3>
      <form onSubmit={handleSubmit} className=" mt-2">
        <div className="rounded-md  ">
          <div className="text-left">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email *
            </label>
            <div className='flex items-center gap-10'>
              <input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-96 border rounded-lg p-2 hover:border-primary transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              <div>
                <Button
                  type="submit"
                  disabled={loading || errors.email}
                >
                  {loading ? (
                    <>
                      <span>Sending code...</span>
                      <Loader2 className="animate-spin h-5 w-5 text-white" />
                    </>
                  ) : (
                    'Send reset code'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>


      </form>
    </div>
  )
}

export default ResetPassword