import { Timestamp } from 'firebase/firestore';
import { Capsule, CapsuleSettings } from '@/types';

// Generate timestamps for consistent seed data
const now = new Date();
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
const sixMonthsFromNow = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

// Capsule settings seed data
export const capsuleSettingsSeed: CapsuleSettings[] = [
  {
    allowSharing: true,
    notificationEnabled: true,
    isPublic: false,
  },
  {
    allowSharing: false,
    notificationEnabled: true,
    isPublic: false,
  },
  {
    allowSharing: true,
    notificationEnabled: false,
    isPublic: true,
  },
  {
    allowSharing: true,
    notificationEnabled: true,
    isPublic: true,
  },
];

// Capsule seed data
export const capsulesSeed: Omit<Capsule, 'id'>[] = [
  {
    title: 'My First Time Capsule',
    description: 'A collection of memories from my first year of college. Photos, videos, and journal entries that capture this amazing journey.',
    userId: 'user1', // Will be replaced with actual user ID
    unlockDate: Timestamp.fromDate(oneYearFromNow),
    isSealed: true,
    isOpened: false,
    tags: ['college', 'memories', 'first-year', 'photos'],
    contentCount: 15,
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    settings: capsuleSettingsSeed[0],
    createdAt: Timestamp.fromDate(oneMonthAgo),
    updatedAt: Timestamp.fromDate(oneWeekAgo),
  },
  {
    title: 'Wedding Memories',
    description: 'The most beautiful day of our lives. Every moment captured to relive forever.',
    userId: 'user2', // Will be replaced with actual user ID
    unlockDate: Timestamp.fromDate(sixMonthsFromNow),
    isSealed: true,
    isOpened: false,
    tags: ['wedding', 'love', 'celebration', 'family'],
    contentCount: 8,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    settings: capsuleSettingsSeed[1],
    createdAt: Timestamp.fromDate(oneWeekAgo),
    updatedAt: Timestamp.fromDate(oneDayAgo),
  },
  {
    title: 'Travel Adventures 2024',
    description: 'Exploring the world one destination at a time. From mountains to beaches, cities to countryside.',
    userId: 'user1', // Will be replaced with actual user ID
    unlockDate: Timestamp.fromDate(threeMonthsFromNow),
    isSealed: false,
    isOpened: false,
    tags: ['travel', 'adventure', '2024', 'exploration'],
    contentCount: 25,
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    settings: capsuleSettingsSeed[2],
    createdAt: Timestamp.fromDate(oneDayAgo),
    updatedAt: Timestamp.fromDate(now),
  },
  {
    title: 'Graduation Celebration',
    description: 'Four years of hard work finally paying off. Celebrating this milestone with friends and family.',
    userId: 'user3', // Will be replaced with actual user ID
    unlockDate: Timestamp.fromDate(oneYearFromNow),
    isSealed: true,
    isOpened: false,
    tags: ['graduation', 'achievement', 'celebration', 'future'],
    contentCount: 12,
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    settings: capsuleSettingsSeed[3],
    createdAt: Timestamp.fromDate(oneWeekAgo),
    updatedAt: Timestamp.fromDate(oneDayAgo),
  },
  {
    title: 'Family Reunion 2024',
    description: 'The whole family together again after years apart. Laughter, stories, and love filling every moment.',
    userId: 'user4', // Will be replaced with actual user ID
    unlockDate: Timestamp.fromDate(sixMonthsFromNow),
    isSealed: true,
    isOpened: false,
    tags: ['family', 'reunion', 'love', 'memories'],
    contentCount: 20,
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    settings: capsuleSettingsSeed[0],
    createdAt: Timestamp.fromDate(oneMonthAgo),
    updatedAt: Timestamp.fromDate(oneWeekAgo),
  },
  {
    title: 'New Year Resolutions',
    description: 'Goals and dreams for the upcoming year. A time capsule to open next New Year\'s Eve.',
    userId: 'user2', // Will be replaced with actual user ID
    unlockDate: Timestamp.fromDate(oneYearFromNow),
    isSealed: true,
    isOpened: false,
    tags: ['new-year', 'goals', 'resolutions', 'future'],
    contentCount: 5,
    coverImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    settings: capsuleSettingsSeed[1],
    createdAt: Timestamp.fromDate(oneMonthAgo),
    updatedAt: Timestamp.fromDate(oneWeekAgo),
  },
];

// Test capsule for development
export const testCapsuleSeed: Omit<Capsule, 'id'> = {
  title: 'Test Capsule',
  description: 'A test capsule for development purposes.',
  userId: 'test-user', // Will be replaced with actual user ID
  unlockDate: Timestamp.fromDate(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
  isSealed: false,
  isOpened: false,
  tags: ['test', 'development'],
  contentCount: 0,
  settings: {
    allowSharing: true,
    notificationEnabled: true,
    isPublic: false,
  },
  createdAt: Timestamp.fromDate(now),
  updatedAt: Timestamp.fromDate(now),
};

// Generate random capsule data for bulk testing
export const generateRandomCapsule = (userId: string, index: number): Omit<Capsule, 'id'> => {
  const titles = [
    'Summer Memories',
    'Winter Wonderland',
    'Spring Awakening',
    'Autumn Colors',
    'Birthday Celebration',
    'Anniversary Special',
    'Vacation Highlights',
    'Friendship Moments',
    'Career Milestones',
    'Personal Growth',
  ];
  
  const descriptions = [
    'A collection of precious moments captured in time.',
    'Memories that will last forever.',
    'The best times of my life.',
    'Moments worth remembering.',
    'A journey through time.',
    'Capturing life\'s beautiful moments.',
    'Stories that matter.',
    'Memories to treasure.',
    'Life\'s greatest adventures.',
    'Moments of joy and happiness.',
  ];
  
  const tagSets = [
    ['memories', 'life', 'joy'],
    ['adventure', 'travel', 'exploration'],
    ['family', 'love', 'happiness'],
    ['friends', 'celebration', 'fun'],
    ['work', 'achievement', 'success'],
    ['nature', 'peace', 'serenity'],
    ['music', 'art', 'creativity'],
    ['food', 'cooking', 'delicious'],
    ['sports', 'fitness', 'health'],
    ['learning', 'growth', 'wisdom'],
  ];
  
  const coverImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  ];
  
  const title = titles[index % titles.length];
  const description = descriptions[Math.floor(index / titles.length) % descriptions.length];
  const tags = tagSets[index % tagSets.length];
  const coverImage = coverImages[index % coverImages.length];
  
  // Random unlock date between 1 month and 2 years from now
  const unlockDate = new Date(now.getTime() + (30 + Math.random() * 700) * 24 * 60 * 60 * 1000);
  
  // Random creation date between 1 week and 6 months ago
  const createdAt = new Date(now.getTime() - (7 + Math.random() * 180) * 24 * 60 * 60 * 1000);
  
  return {
    title,
    description,
    userId,
    unlockDate: Timestamp.fromDate(unlockDate),
    isSealed: Math.random() > 0.3,
    isOpened: false,
    tags,
    contentCount: Math.floor(Math.random() * 20),
    coverImage,
    settings: capsuleSettingsSeed[Math.floor(Math.random() * capsuleSettingsSeed.length)],
    createdAt: Timestamp.fromDate(createdAt),
    updatedAt: Timestamp.fromDate(new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)),
  };
};

// Generate multiple random capsules for a user
export const generateRandomCapsules = (userId: string, count: number): Omit<Capsule, 'id'>[] => {
  return Array.from({ length: count }, (_, index) => generateRandomCapsule(userId, index));
};
