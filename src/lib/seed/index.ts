import { 
  usersSeed, 
  testUserSeed, 
  adminUserSeed, 
  generateRandomUsers 
} from './users';
import { 
  capsulesSeed, 
  testCapsuleSeed, 
  generateRandomCapsules 
} from './capsules';
import { 
  contentSeed, 
  generateRandomContentItems 
} from './content';
import { 
  systemConfigSeed, 
  notificationDataSeed, 
  capsuleAnalyticsSeed,
  generateRandomNotifications,
  generateRandomAnalyticsForCapsules
} from './system';

// Seed data configuration
export interface SeedConfig {
  users: {
    count: number;
    includeTestUser: boolean;
    includeAdminUser: boolean;
  };
  capsules: {
    countPerUser: number;
    includeTestCapsule: boolean;
  };
  content: {
    countPerCapsule: number;
  };
  system: {
    includeNotifications: boolean;
    includeAnalytics: boolean;
  };
}

// Default seed configuration
export const defaultSeedConfig: SeedConfig = {
  users: {
    count: 5,
    includeTestUser: true,
    includeAdminUser: true,
  },
  capsules: {
    countPerUser: 3,
    includeTestCapsule: true,
  },
  content: {
    countPerCapsule: 5,
  },
  system: {
    includeNotifications: true,
    includeAnalytics: true,
  },
};

// Generate complete seed data
export const generateSeedData = (config: SeedConfig = defaultSeedConfig) => {
  const users: any[] = [];
  const capsules: any[] = [];
  const content: any[] = [];
  const notifications: any[] = [];
  const analytics: any[] = [];
  
  // Generate users
  if (config.users.includeTestUser) {
    users.push({ ...testUserSeed, id: 'test-user' });
  }
  
  if (config.users.includeAdminUser) {
    users.push({ ...adminUserSeed, id: 'admin-user' });
  }
  
  // Add predefined users
  usersSeed.forEach((user, index) => {
    users.push({ ...user, id: `user${index + 1}` });
  });
  
  // Add random users if needed
  const remainingUsers = config.users.count - users.length;
  if (remainingUsers > 0) {
    const randomUsers = generateRandomUsers(remainingUsers);
    randomUsers.forEach((user, index) => {
      users.push({ ...user, id: `random-user-${index + 1}` });
    });
  }
  
  // Generate capsules for each user
  users.forEach(user => {
    if (config.capsules.includeTestCapsule && user.id === 'test-user') {
      capsules.push({ ...testCapsuleSeed, id: 'test-capsule', userId: user.id });
    }
    
    // Add predefined capsules
    capsulesSeed.forEach((capsule, index) => {
      if (capsule.userId === `user${index + 1}`) {
        capsules.push({ ...capsule, id: `capsule${index + 1}`, userId: user.id });
      }
    });
    
    // Add random capsules
    const randomCapsules = generateRandomCapsules(user.id, config.capsules.countPerUser);
    randomCapsules.forEach((capsule, index) => {
      capsules.push({ ...capsule, id: `${user.id}-capsule-${index + 1}` });
    });
  });
  
  // Generate content for each capsule
  capsules.forEach(capsule => {
    // Add predefined content
    contentSeed.forEach((contentItem, index) => {
      if (contentItem.capsuleId === `capsule${index + 1}`) {
        content.push({ ...contentItem, id: `content${index + 1}`, capsuleId: capsule.id });
      }
    });
    
    // Add random content
    const randomContent = generateRandomContentItems(capsule.id, config.content.countPerCapsule);
    randomContent.forEach((contentItem, index) => {
      content.push({ ...contentItem, id: `${capsule.id}-content-${index + 1}` });
    });
  });
  
  // Generate system data
  if (config.system.includeNotifications) {
    // Add predefined notifications
    notificationDataSeed.forEach((notification, index) => {
      notifications.push({ ...notification, id: `notification${index + 1}` });
    });
    
    // Add random notifications
    users.forEach(user => {
      const userCapsules = capsules.filter(capsule => capsule.userId === user.id);
      userCapsules.forEach(capsule => {
        const randomNotifications = generateRandomNotifications(user.id, capsule.id, 2);
        randomNotifications.forEach((notification, index) => {
          notifications.push({ 
            ...notification, 
            id: `${user.id}-${capsule.id}-notification-${index + 1}` 
          });
        });
      });
    });
  }
  
  if (config.system.includeAnalytics) {
    // Add predefined analytics
    capsuleAnalyticsSeed.forEach((analytic, index) => {
      analytics.push({ ...analytic, id: `analytics${index + 1}` });
    });
    
    // Add random analytics
    const capsuleIds = capsules.map(capsule => capsule.id);
    const randomAnalytics = generateRandomAnalyticsForCapsules(capsuleIds);
    randomAnalytics.forEach((analytic, index) => {
      analytics.push({ ...analytic, id: `analytics-${index + 1}` });
    });
  }
  
  return {
    users,
    capsules,
    content,
    notifications,
    analytics,
    systemConfig: { ...systemConfigSeed, id: 'system-config' },
  };
};

// Utility functions for seed data
export const getSeedDataById = (data: any[], id: string) => {
  return data.find(item => item.id === id);
};

export const getSeedDataByUserId = (data: any[], userId: string) => {
  return data.filter(item => item.userId === userId);
};

export const getSeedDataByCapsuleId = (data: any[], capsuleId: string) => {
  return data.filter(item => item.capsuleId === capsuleId);
};

export const getRandomSeedData = (data: any[], count: number = 1) => {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getSeedDataCounts = (seedData: any) => {
  return {
    users: seedData.users.length,
    capsules: seedData.capsules.length,
    content: seedData.content.length,
    notifications: seedData.notifications.length,
    analytics: seedData.analytics.length,
  };
};

// Export individual seed data for direct use
export {
  usersSeed,
  testUserSeed,
  adminUserSeed,
  generateRandomUsers,
  capsulesSeed,
  testCapsuleSeed,
  generateRandomCapsules,
  contentSeed,
  generateRandomContentItems,
  systemConfigSeed,
  notificationDataSeed,
  capsuleAnalyticsSeed,
  generateRandomNotifications,
  generateRandomAnalyticsForCapsules,
};
