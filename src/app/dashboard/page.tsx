'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { UserService } from '@/lib/services/userService';
import type { UserValidation } from '@/lib/validation/user';
import { isAuthBypassEnabled, getMockUser, getMockProfile } from '@/lib/auth/bypassConfig';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isAuthBypassEnabled()) {
      // Bypass authentication - use mock user
      setUser(getMockUser() as User);
      setUserProfile(getMockProfile() as UserValidation);
      setLoading(false);
    } else {
      // Normal authentication flow
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUser(user);
          
          // Load user profile from Firestore
          try {
            const profile = await UserService.getUser(user.uid);
            setUserProfile(profile);
            
            // Update last active timestamp
            await UserService.updateLastActive(user.uid);
          } catch (error) {
            console.error('Error loading user profile:', error);
          }
        } else {
          router.push('/login');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [router]);

  const handleSignOut = async () => {
    // Bypass sign out - just redirect to home
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#1B2638'}}>
      {/* Navigation */}
      <nav className="shadow" style={{backgroundColor: '#CB343F'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-white font-display">Time Capsule</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#1B2638'}}>
                  <span className="text-sm font-medium text-white">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white font-body">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-200 font-body">{user.email}</p>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="bg-white hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                Welcome back, {user.displayName || 'User'}!
              </h2>
              <p className="text-gray-600 font-body">
                You're successfully signed in to your Time Capsule account.
                {userProfile?.role === 'admin' || userProfile?.role === 'super_admin' ? (
                  <span className="block mt-2 text-sm font-medium text-red-600">
                    🔐 Admin Access - You have administrative privileges
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          {/* Admin Actions - Only show for admin users */}
          {(userProfile?.role === 'admin' || userProfile?.role === 'super_admin') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Admin Panel */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{backgroundColor: '#CB343F'}}>
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 font-display">Admin Panel</h3>
                      <p className="text-sm text-gray-500 font-body">System administration</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90" style={{backgroundColor: '#CB343F', color: 'white'}}>
                      Access Admin Panel
                    </button>
                  </div>
                </div>
              </div>

              {/* User Management */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{backgroundColor: '#CB343F'}}>
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 font-display">User Management</h3>
                      <p className="text-sm text-gray-500 font-body">Manage users & roles</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90" style={{backgroundColor: '#CB343F', color: 'white'}}>
                      Manage Users
                    </button>
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{backgroundColor: '#CB343F'}}>
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 font-display">Analytics</h3>
                      <p className="text-sm text-gray-500 font-body">View system analytics</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90" style={{backgroundColor: '#CB343F', color: 'white'}}>
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>

              {/* System Settings */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{backgroundColor: '#CB343F'}}>
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 font-display">System Settings</h3>
                      <p className="text-sm text-gray-500 font-body">Configure system</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90" style={{backgroundColor: '#CB343F', color: 'white'}}>
                      System Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create Capsule */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{backgroundColor: '#CB343F'}}>
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 font-display">Create New Capsule</h3>
                    <p className="text-sm text-gray-500 font-body">Start preserving your memories</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/create-capsule"
                    className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90 inline-block text-center" 
                    style={{backgroundColor: '#CB343F', color: 'white'}}
                  >
                    Create Capsule
                  </Link>
                </div>
              </div>
            </div>

            {/* View Capsules */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-green-600 rounded-md flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 font-display">My Capsules</h3>
                    <p className="text-sm text-gray-500 font-body">View your time capsules</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90" style={{backgroundColor: '#CB343F', color: 'white'}}>
                    View Capsules
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Settings */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-purple-600 rounded-md flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 font-display">Profile Settings</h3>
                    <p className="text-sm text-gray-500 font-body">Manage your account</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-90" style={{backgroundColor: '#CB343F', color: 'white'}}>
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 font-display">Account Information</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 font-body">Display Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-body">{user.displayName || 'Not set'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 font-body">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-body">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 font-body">Email Verified</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.emailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 font-body">Account Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-body">
                    {user.metadata.creationTime 
                      ? new Date(user.metadata.creationTime).toLocaleDateString()
                      : 'Unknown'
                    }
                  </dd>
                </div>
                {userProfile && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 font-body">User Role</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userProfile.role === 'super_admin' 
                            ? 'bg-purple-100 text-purple-800'
                            : userProfile.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {userProfile.role === 'super_admin' ? 'Super Admin' : 
                           userProfile.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 font-body">Account Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userProfile.accountStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : userProfile.accountStatus === 'suspended'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userProfile.accountStatus.charAt(0).toUpperCase() + userProfile.accountStatus.slice(1)}
                        </span>
                      </dd>
                    </div>
                    {userProfile.permissions && userProfile.permissions.length > 0 && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500 font-body">Permissions</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <div className="flex flex-wrap gap-1">
                            {userProfile.permissions.map((permission, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                {permission.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </dd>
                      </div>
                    )}
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
