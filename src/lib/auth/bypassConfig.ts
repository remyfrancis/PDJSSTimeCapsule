// Authentication bypass configuration
export const AUTH_BYPASS_CONFIG = {
  // Set to true to bypass authentication
  enabled: process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true' || true, // Default to true for now
  
  // Mock user data
  mockUser: {
    uid: 'mock-user-123',
    email: 'admin@timecapsule.com',
    displayName: 'Admin User',
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString()
    }
  },
  
  // Mock user profile
  mockProfile: {
    id: 'mock-user-123',
    email: 'admin@timecapsule.com',
    displayName: 'Admin User',
    lastActive: new Date(),
    isEmailVerified: true,
    accountStatus: 'active' as const,
    role: 'admin' as const,
    permissions: [
      'manage_users',
      'manage_capsules',
      'view_analytics',
      'manage_system_settings'
    ],
    preferences: {
      emailNotifications: true,
      theme: 'light' as const,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }
};

// Helper function to check if bypass is enabled
export const isAuthBypassEnabled = () => AUTH_BYPASS_CONFIG.enabled;

// Helper function to get mock user
export const getMockUser = () => AUTH_BYPASS_CONFIG.mockUser;

// Helper function to get mock profile
export const getMockProfile = () => AUTH_BYPASS_CONFIG.mockProfile;
