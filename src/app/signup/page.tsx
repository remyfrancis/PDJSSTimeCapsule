'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { validateEmail, validatePassword } from '@/lib/validation';
import { UserService } from '@/lib/services/userService';
import { AuthErrorHandler } from '@/lib/auth/errorHandler';
import { LoadingButton, ErrorDisplay, FormLoadingState, useLoadingState, useRetry } from '@/components/auth/LoadingComponents';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Enhanced loading states
  const emailSignupLoading = useLoadingState();
  const googleSignupLoading = useLoadingState();
  const emailRetry = useRetry('email-signup');
  const googleRetry = useRetry('google-signup');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    emailRetry.resetRetry();

    // Validation
    if (!formData.displayName.trim()) {
      setError('Display name is required');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    emailSignupLoading.setLoading(true, 'Creating your account...');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      emailSignupLoading.setLoading(true, 'Setting up your profile...', 50);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: formData.displayName.trim(),
      });

      emailSignupLoading.setLoading(true, 'Configuring admin access...', 75);

      // Create user document in Firestore with admin role
      await UserService.createUser({
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.displayName.trim(),
        profilePicture: userCredential.user.photoURL || undefined,
        role: 'admin', // All signups create admin users
        permissions: [
          'manage_users',
          'manage_capsules',
          'view_analytics',
          'manage_system_settings'
        ],
      });

      emailSignupLoading.setLoading(true, 'Finalizing setup...', 90);

      // Update last active timestamp
      await UserService.updateLastActive(userCredential.user.uid);

      emailSignupLoading.setLoading(true, 'Redirecting to dashboard...', 100);

      // Small delay to show completion
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);

    } catch (error: any) {
      console.error('Signup error:', error);
      const authError = AuthErrorHandler.getError(error.code);
      setError(authError.code);
      
      if (authError.retryable && emailRetry.canRetry) {
        emailRetry.incrementRetry();
      }
    } finally {
      emailSignupLoading.clearLoading();
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    googleRetry.resetRetry();
    googleSignupLoading.setLoading(true, 'Connecting to Google...');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      googleSignupLoading.setLoading(true, 'Setting up your account...', 50);
      
      // Check if user document exists, if not create one
      const existingUser = await UserService.getUser(result.user.uid);
      
      if (!existingUser) {
        googleSignupLoading.setLoading(true, 'Creating admin profile...', 75);
        
        // Create user document for Google signup with admin role
        await UserService.createUser({
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          profilePicture: result.user.photoURL || undefined,
          role: 'admin', // All signups create admin users
          permissions: [
            'manage_users',
            'manage_capsules',
            'view_analytics',
            'manage_system_settings'
          ],
        });
      }

      googleSignupLoading.setLoading(true, 'Finalizing setup...', 90);

      // Update last active timestamp
      await UserService.updateLastActive(result.user.uid);

      googleSignupLoading.setLoading(true, 'Redirecting to dashboard...', 100);

      // Small delay to show completion
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);

    } catch (error: any) {
      console.error('Google signup error:', error);
      const authError = AuthErrorHandler.getError(error.code);
      setError(authError.code);
      
      if (authError.retryable && googleRetry.canRetry) {
        googleRetry.incrementRetry();
      }
    } finally {
      googleSignupLoading.clearLoading();
    }
  };

  const handleRetryEmailSignup = () => {
    if (emailRetry.canRetry) {
      setTimeout(() => {
        handleEmailSignup(new Event('submit') as any);
      }, emailRetry.retryDelay);
    }
  };

  const handleRetryGoogleSignup = () => {
    if (googleRetry.canRetry) {
      setTimeout(() => {
        handleGoogleSignup();
      }, googleRetry.retryDelay);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#1B2638'}}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#CB343F'}}>
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white font-display">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-300 font-body">
            Start preserving your memories today
          </p>
        </div>

        {/* Signup Form */}
        <FormLoadingState 
          loading={emailSignupLoading.isLoading} 
          loadingMessage={emailSignupLoading.loadingMessage}
        >
          <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
            <form className="space-y-6" onSubmit={handleEmailSignup}>
            {/* Display Name Field */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 font-body">
                Display Name
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm text-gray-900"
                  style={{'--tw-ring-color': '#CB343F'} as React.CSSProperties}
                  placeholder="Enter your display name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-body">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm text-gray-900"
                  style={{'--tw-ring-color': '#CB343F'} as React.CSSProperties}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-body">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm text-gray-900"
                  style={{'--tw-ring-color': '#CB343F'} as React.CSSProperties}
                  placeholder="Create a password"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 font-body">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm text-gray-900"
                  style={{'--tw-ring-color': '#CB343F'} as React.CSSProperties}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                  className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-offset-2"
                  style={{accentColor: '#CB343F', '--tw-ring-color': '#CB343F'} as React.CSSProperties}
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link href="/terms" className="hover:opacity-80" style={{color: '#CB343F'}}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="hover:opacity-80" style={{color: '#CB343F'}}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Error Message */}
            <ErrorDisplay 
              error={error}
              onRetry={handleRetryEmailSignup}
              onDismiss={() => setError('')}
              retryable={emailRetry.canRetry}
            />

            {/* Sign Up Button */}
            <LoadingButton
              loading={emailSignupLoading.isLoading}
              loadingText={emailSignupLoading.loadingMessage}
              type="submit"
              disabled={emailSignupLoading.isLoading || googleSignupLoading.isLoading}
            >
              Create account
            </LoadingButton>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <LoadingButton
              loading={googleSignupLoading.isLoading}
              loadingText={googleSignupLoading.loadingMessage}
              type="button"
              onClick={handleGoogleSignup}
              disabled={emailSignupLoading.isLoading || googleSignupLoading.isLoading}
              variant="outline"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Sign up with Google</span>
            </LoadingButton>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium hover:opacity-80" style={{color: '#CB343F'}}>
                Sign in
              </Link>
            </p>
          </div>
          </div>
        </FormLoadingState>

        {/* Footer */}
        <div className="text-center text-xs text-gray-300">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
