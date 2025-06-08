'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import Header from '@/components/homeComponents/Header';

export default function ForgotPasswordPage() {
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
        <>
            <div className='bg-gradient-to-b to-[#b3bfe9] min-h-screen'>
                <Header />
                <div className=" max-w-xl mx-auto py-12 px-4 sm:px-6 lg:px-8 ">
                    <div className="max-w-md w-full  bg-white p-8 rounded-2xl shadow-2xl">
                        <div className="flex flex-col justify-center items-center">
                            <img
                                src="https://cdn-icons-png.freepik.com/256/12219/12219540.png?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid"
                                alt="Chatbotify logo"
                                className="w-10 h-10"
                            />
                        </div>
                        <div className="text-center">
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Forgot your password?
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Enter your email and we'll send you a code to reset your password
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className=" space-y-6 mt-8">
                            <div className="rounded-md  ">
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
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading || errors.email}
                                    className={` w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white ${loading || errors.email ? 'bg-blue-600 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-700'
                                        } transition-colors flex items-center justify-center gap-2`}
                                >
                                    {loading ? (
                                        <>
                                            <span>Sending code...</span>
                                            <Loader2 className="animate-spin h-5 w-5 text-white" />
                                        </>
                                    ) : (
                                        'Send reset code'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="text-center text-sm mt-4">
                            <Link href="/auth/login" className="text-blue-600 hover:underline">
                                Back to login
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}