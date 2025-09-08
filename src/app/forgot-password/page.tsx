'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { validateEmail } from '@/lib/validation';
import { AuthFormField, ErrorMessage, LoadingButton } from '@/components/auth/AuthComponents';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later';
      default:
        return 'An error occurred while sending the reset email';
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#1B2638'}}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              We've sent a password reset link to <strong className="text-white">{email}</strong>
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="w-full text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Try a different email address
                </button>
                
                <Link
                  href="/login"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="text-indigo-600 hover:text-indigo-500"
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#1B2638'}}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
            <h2 className="mt-6 text-3xl font-bold text-white">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Enter your email address and we'll send you a link to reset your password
            </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleResetPassword}>
            {/* Email Field */}
            <AuthFormField
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            {/* Error Message */}
            <ErrorMessage error={error} />

            {/* Reset Button */}
            <LoadingButton
              loading={loading}
              type="submit"
            >
              {loading ? 'Sending reset link...' : 'Send reset link'}
            </LoadingButton>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>
            Need help? Contact our{' '}
            <Link href="/support" className="text-indigo-600 hover:text-indigo-500">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
