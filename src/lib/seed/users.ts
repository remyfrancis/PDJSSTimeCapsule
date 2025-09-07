import { Timestamp } from 'firebase/firestore';
import { User, UserPreferences } from '@/types';

// Generate timestamps for consistent seed data
const now = new Date();
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

// User preferences seed data
export const userPreferencesSeed: UserPreferences[] = [
  {
    emailNotifications: true,
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
  },
  {
    emailNotifications: false,
    theme: 'dark',
    language: 'en',
    timezone: 'Europe/London',
  },
  {
    emailNotifications: true,
    theme: 'dark',
    language: 'es',
    timezone: 'America/Los_Angeles',
  },
  {
    emailNotifications: true,
    theme: 'light',
    language: 'fr',
    timezone: 'Europe/Paris',
  },
];

// User seed data
export const usersSeed: Omit<User, 'id'>[] = [
  {
    email: 'john.doe@example.com',
    displayName: 'John Doe',
    lastActive: Timestamp.fromDate(now),
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    preferences: userPreferencesSeed[0],
    isEmailVerified: true,
    accountStatus: 'active',
    createdAt: Timestamp.fromDate(oneMonthAgo),
    updatedAt: Timestamp.fromDate(oneDayAgo),
  },
  {
    email: 'jane.smith@example.com',
    displayName: 'Jane Smith',
    lastActive: Timestamp.fromDate(oneDayAgo),
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    preferences: userPreferencesSeed[1],
    isEmailVerified: true,
    accountStatus: 'active',
    createdAt: Timestamp.fromDate(oneWeekAgo),
    updatedAt: Timestamp.fromDate(oneDayAgo),
  },
  {
    email: 'mike.wilson@example.com',
    displayName: 'Mike Wilson',
    lastActive: Timestamp.fromDate(oneWeekAgo),
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    preferences: userPreferencesSeed[2],
    isEmailVerified: false,
    accountStatus: 'active',
    createdAt: Timestamp.fromDate(oneMonthAgo),
    updatedAt: Timestamp.fromDate(oneWeekAgo),
  },
  {
    email: 'sarah.jones@example.com',
    displayName: 'Sarah Jones',
    lastActive: Timestamp.fromDate(now),
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    preferences: userPreferencesSeed[3],
    isEmailVerified: true,
    accountStatus: 'active',
    createdAt: Timestamp.fromDate(oneWeekAgo),
    updatedAt: Timestamp.fromDate(now),
  },
  {
    email: 'demo.user@example.com',
    displayName: 'Demo User',
    lastActive: Timestamp.fromDate(oneDayAgo),
    preferences: {
      emailNotifications: true,
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
    },
    isEmailVerified: true,
    accountStatus: 'active',
    createdAt: Timestamp.fromDate(oneMonthAgo),
    updatedAt: Timestamp.fromDate(oneDayAgo),
  },
];

// Test user for development
export const testUserSeed: Omit<User, 'id'> = {
  email: 'test@example.com',
  displayName: 'Test User',
  lastActive: Timestamp.fromDate(now),
  preferences: {
    emailNotifications: true,
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
  },
  isEmailVerified: true,
  accountStatus: 'active',
  createdAt: Timestamp.fromDate(oneMonthAgo),
  updatedAt: Timestamp.fromDate(now),
};

// Admin user for testing
export const adminUserSeed: Omit<User, 'id'> = {
  email: 'admin@example.com',
  displayName: 'Admin User',
  lastActive: Timestamp.fromDate(now),
  preferences: {
    emailNotifications: true,
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
  },
  isEmailVerified: true,
  accountStatus: 'active',
  createdAt: Timestamp.fromDate(oneMonthAgo),
  updatedAt: Timestamp.fromDate(now),
};

// Generate random user data for bulk testing
export const generateRandomUser = (index: number): Omit<User, 'id'> => {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
  const lastNames = ['Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Green', 'Harris', 'Johnson', 'King'];
  const themes = ['light', 'dark'] as const;
  const languages = ['en', 'es', 'fr', 'de', 'it'];
  const timezones = ['America/New_York', 'Europe/London', 'America/Los_Angeles', 'Europe/Paris', 'Asia/Tokyo'];
  
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  
  return {
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    displayName: `${firstName} ${lastName}`,
    lastActive: Timestamp.fromDate(new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
    profilePicture: `https://images.unsplash.com/photo-${1500000000000 + index}?w=150&h=150&fit=crop&crop=face`,
    preferences: {
      emailNotifications: Math.random() > 0.5,
      theme: themes[Math.floor(Math.random() * themes.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      timezone: timezones[Math.floor(Math.random() * timezones.length)],
    },
    isEmailVerified: Math.random() > 0.2,
    accountStatus: Math.random() > 0.1 ? 'active' : 'suspended',
    createdAt: Timestamp.fromDate(new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)),
  };
};

// Generate multiple random users
export const generateRandomUsers = (count: number): Omit<User, 'id'>[] => {
  return Array.from({ length: count }, (_, index) => generateRandomUser(index));
};
