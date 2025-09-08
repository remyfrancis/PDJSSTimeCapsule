'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { isAuthBypassEnabled } from '@/lib/auth/bypassConfig';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthBypassEnabled()) {
      // Bypass login and go directly to dashboard
      router.push('/dashboard');
    } else {
      // Normal authentication flow
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          router.push('/dashboard');
        }
      });

      return () => unsubscribe();
    }
  }, [router]);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#1B2638'}}>
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3" style={{backgroundColor: '#CB343F'}}>
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white font-display">Time Capsule</h1>
          </div>
          
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-md font-medium transition-colors hover:opacity-90" style={{backgroundColor: '#CB343F', color: 'white'}}
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 font-display">
            Preserve Your Memories
            <span className="block" style={{color: '#CB343F'}}>For the Future</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-body">
            Create digital time capsules to store your precious memories, photos, videos, and messages. 
            Set them to unlock on special dates and share them with future generations.
          </p>
          
          <div className="space-x-4">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-lg font-medium text-lg transition-colors hover:opacity-90" style={{backgroundColor: '#CB343F', color: 'white'}}
            >
              Start Creating Capsules
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg font-medium text-lg border transition-colors hover:opacity-80" style={{color: '#CB343F', borderColor: '#CB343F', backgroundColor: 'white'}}
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#1B2638'}}>
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: '#CB343F'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 font-display">Time-Locked</h3>
            <p className="text-gray-300 font-body">
              Set your capsules to unlock on specific dates, creating anticipation and surprise for the future.
            </p>
          </div>
          
          <div className="text-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#1B2638'}}>
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: '#CB343F'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 font-display">Rich Media</h3>
            <p className="text-gray-300 font-body">
              Store photos, videos, audio recordings, documents, and text messages all in one place.
            </p>
          </div>
          
          <div className="text-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#1B2638'}}>
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: '#CB343F'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 font-display">Share & Collaborate</h3>
            <p className="text-gray-300 font-body">
              Share your capsules with family and friends, or keep them private for personal reflection.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl p-8 text-center text-white" style={{backgroundColor: '#CB343F'}}>
          <h2 className="text-3xl font-bold mb-4 font-display">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-6 opacity-90 font-body">
            Join thousands of users who are already preserving their memories for the future.
          </p>
          <Link
            href="/signup"
            className="px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block hover:opacity-90" style={{backgroundColor: 'white', color: '#CB343F'}}
          >
            Create Your First Capsule
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-300">
          <div className="space-x-6 mb-4">
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </div>
          <p>&copy; 2025 Time Capsule. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
