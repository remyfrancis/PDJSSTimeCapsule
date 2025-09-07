import { Timestamp } from 'firebase/firestore';
import { SystemConfig, NotificationData, CapsuleAnalytics } from '@/types';

// Generate timestamps for consistent seed data
const now = new Date();
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

// System configuration seed data
export const systemConfigSeed: Omit<SystemConfig, 'id'> = {
  maintenanceMode: false,
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'application/pdf',
    'text/plain',
    'text/markdown',
  ],
  maxCapsulesPerUser: 50,
  maxContentPerCapsule: 100,
  version: '1.0.0',
  createdAt: Timestamp.fromDate(oneMonthAgo),
  updatedAt: Timestamp.fromDate(oneWeekAgo),
};

// Notification data seed
export const notificationDataSeed: Omit<NotificationData, 'id'>[] = [
  {
    userId: 'user1',
    type: 'unlock_reminder',
    capsuleId: 'capsule1',
    title: 'Your time capsule unlocks soon!',
    message: 'Your "My First Time Capsule" will be ready to open in 7 days.',
    scheduledFor: Timestamp.fromDate(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)),
    sentAt: undefined,
    readAt: undefined,
  },
  {
    userId: 'user2',
    type: 'unlock_ready',
    capsuleId: 'capsule2',
    title: 'Your time capsule is ready!',
    message: 'Your "Wedding Memories" capsule is now ready to be opened.',
    scheduledFor: Timestamp.fromDate(now),
    sentAt: Timestamp.fromDate(now),
    readAt: undefined,
  },
  {
    userId: 'user1',
    type: 'capsule_opened',
    capsuleId: 'capsule3',
    title: 'Capsule opened successfully',
    message: 'You have successfully opened your "Travel Adventures 2024" capsule.',
    scheduledFor: undefined,
    sentAt: Timestamp.fromDate(oneDayAgo),
    readAt: Timestamp.fromDate(oneDayAgo),
  },
];

// Capsule analytics seed data
export const capsuleAnalyticsSeed: Omit<CapsuleAnalytics, 'id'>[] = [
  {
    capsuleId: 'capsule1',
    viewCount: 15,
    shareCount: 3,
    openCount: 1,
    lastViewed: Timestamp.fromDate(oneDayAgo),
    averageViewDuration: 120, // 2 minutes
  },
  {
    capsuleId: 'capsule2',
    viewCount: 8,
    shareCount: 1,
    openCount: 0,
    lastViewed: Timestamp.fromDate(oneWeekAgo),
    averageViewDuration: 90, // 1.5 minutes
  },
  {
    capsuleId: 'capsule3',
    viewCount: 25,
    shareCount: 5,
    openCount: 1,
    lastViewed: Timestamp.fromDate(now),
    averageViewDuration: 180, // 3 minutes
  },
  {
    capsuleId: 'capsule4',
    viewCount: 12,
    shareCount: 2,
    openCount: 0,
    lastViewed: Timestamp.fromDate(oneDayAgo),
    averageViewDuration: 75, // 1.25 minutes
  },
];

// Generate random notification data
export const generateRandomNotification = (userId: string, capsuleId: string, index: number): Omit<NotificationData, 'id'> => {
  const types = ['unlock_reminder', 'unlock_ready', 'capsule_opened'] as const;
  const type = types[index % types.length];
  
  const titles = [
    'Your time capsule unlocks soon!',
    'Your time capsule is ready!',
    'Capsule opened successfully',
    'Reminder: Capsule unlock approaching',
    'New capsule activity',
  ];
  
  const messages = [
    'Your time capsule will be ready to open soon.',
    'Your time capsule is now ready to be opened.',
    'You have successfully opened your capsule.',
    'Don\'t forget about your upcoming capsule unlock.',
    'There has been activity on your capsule.',
  ];
  
  const title = titles[index % titles.length];
  const message = messages[index % messages.length];
  
  let scheduledFor: Timestamp | undefined;
  let sentAt: Timestamp | undefined;
  let readAt: Timestamp | undefined;
  
  switch (type) {
    case 'unlock_reminder':
      scheduledFor = Timestamp.fromDate(new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000));
      break;
    case 'unlock_ready':
      scheduledFor = Timestamp.fromDate(now);
      sentAt = Timestamp.fromDate(now);
      break;
    case 'capsule_opened':
      sentAt = Timestamp.fromDate(new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000));
      readAt = Math.random() > 0.3 ? Timestamp.fromDate(new Date(sentAt.toDate().getTime() + Math.random() * 24 * 60 * 60 * 1000)) : undefined;
      break;
  }
  
  return {
    userId,
    type,
    capsuleId,
    title,
    message,
    scheduledFor,
    sentAt,
    readAt,
  };
};

// Generate random analytics data
export const generateRandomAnalytics = (capsuleId: string): Omit<CapsuleAnalytics, 'id'> => {
  const viewCount = Math.floor(Math.random() * 100) + 1;
  const shareCount = Math.floor(Math.random() * 20) + 1;
  const openCount = Math.floor(Math.random() * 5);
  
  return {
    capsuleId,
    viewCount,
    shareCount,
    openCount,
    lastViewed: Timestamp.fromDate(new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
    averageViewDuration: Math.floor(Math.random() * 300) + 30, // 30 seconds to 5 minutes
  };
};

// Generate multiple random notifications
export const generateRandomNotifications = (userId: string, capsuleId: string, count: number): Omit<NotificationData, 'id'>[] => {
  return Array.from({ length: count }, (_, index) => generateRandomNotification(userId, capsuleId, index));
};

// Generate multiple random analytics
export const generateRandomAnalyticsForCapsules = (capsuleIds: string[]): Omit<CapsuleAnalytics, 'id'>[] => {
  return capsuleIds.map(capsuleId => generateRandomAnalytics(capsuleId));
};
