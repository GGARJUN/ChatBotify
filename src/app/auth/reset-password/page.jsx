'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Loader2 } from 'lucide-react';
import Header from '@/components/homeComponents/Header';

export default function ResetPasswordPage() {
    const [formValues, setFormValues] = useState({
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [passwordScore, setPasswordScore] = useState(0);
    const { resetPassword, loading } = useAuth();

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                if (!value) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
                return '';
            case 'code':
                if (!value) return 'Verification code is required';
                return '';
            case 'newPassword':
                if (!value) return 'Password is required';
                if (value.length < 8) return 'Password must be at least 8 characters';
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value))
                    return 'Password must contain uppercase, lowercase, number and special character';
                return '';
            case 'confirmPassword':
                if (value !== formValues.newPassword) return 'Passwords do not match';
                return '';
            default:
                return '';
        }
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

        const newErrors = {};
        Object.keys(formValues).forEach(key => {
            newErrors[key] = validateField(key, formValues[key]);
        });

        setErrors(newErrors);
        setTouched(Object.keys(formValues).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        try {
            await resetPassword(formValues.email, formValues.code, formValues.newPassword);
        } catch (error) {
            console.error('Reset password error:', error);
        }
    };

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setErrors({});
        }
    }, [formValues]);

    return (
        <div className='bg-gradient-to-b to-[#b3bfe9] min-h-screen'>
            <Header />
            <div className=" max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 ">
                <div className=" w-full  bg-white p-8 rounded-2xl shadow-2xl">
                    <div className="flex flex-col justify-center items-center">
                        <img
                            src="https://cdn-icons-png.freepik.com/256/12219/12219540.png?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid"
                            alt="Chatbotify logo"
                            className="w-10 h-10"
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Reset your password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter the code you received and your new password
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="rounded-md  space-y-4">
                            <div className='flex justify-between items-center gap-6'>
                                <div className="text-left w-full">
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                                        Email *
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formValues.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full border rounded-lg p-3 hover:border-primary transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'} `}
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="text-left w-full">
                                    <label htmlFor="code" className="block text-sm font-medium mb-1">
                                        Verification code *
                                    </label>
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        required
                                        value={formValues.code}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full border rounded-lg p-3 hover:border-primary transition-all duration-300 ${errors.code ? 'border-red-500' : 'border-gray-300'} `}
                                        placeholder="Enter 6-digit code"
                                    />
                                    {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                                </div>
                            </div>

                            <div className="text-left">
                                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                                    New password *
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    value={formValues.newPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border rounded-lg p-3 hover:border-primary transition-all duration-300 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} `}
                                    placeholder="At least 8 characters"
                                />
                                <PasswordStrengthBar
                                    password={formValues.newPassword}
                                    onChangeScore={(score) => setPasswordScore(score)}
                                    className="mt-2"
                                />
                                {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                                <p className="mt-1 text-xs text-gray-500">
                                    Password must contain at least 8 characters, including uppercase, lowercase, number and special character.
                                </p>
                            </div>

                            <div className="text-left">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                    Confirm new password *
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formValues.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border rounded-lg p-3 hover:border-primary transition-all duration-300 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || passwordScore < 3 || Object.values(errors).some(error => error)}
                                className={`w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white ${loading || passwordScore < 3 || Object.values(errors).some(error => error)
                                    ? 'bg-blue-600 cursor-not-allowed opacity-50'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                    } transition-colors flex items-center justify-center gap-2`}
                            >
                                {loading ? (
                                    <>
                                        <span>Resetting password...</span>
                                        <Loader2 className="animate-spin h-5 w-5 text-white" />
                                    </>
                                ) : (
                                    'Reset password'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center text-sm mt-4">
                        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}