#!/usr/bin/env tsx
import 'dotenv/config';

/**
 * Seed Data Script for Firebase Time Capsule
 * 
 * This script populates your Firestore database with development seed data.
 * Run with: npm run seed or tsx scripts/seed-database.ts
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch, getDocs } from 'firebase/firestore';
import { generateSeedData, defaultSeedConfig, getSeedDataCounts } from '../src/lib/seed';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Seed data configuration
const seedConfig = {
  users: {
    count: 10,
    includeTestUser: true,
    includeAdminUser: true,
  },
  capsules: {
    countPerUser: 5,
    includeTestCapsule: true,
  },
  content: {
    countPerCapsule: 8,
  },
  system: {
    includeNotifications: true,
    includeAnalytics: true,
  },
};

// Clean data for Firestore (remove undefined values)
const cleanDataForFirestore = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(cleanDataForFirestore);
  }
  
  if (data && typeof data === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = cleanDataForFirestore(value);
      }
    }
    return cleaned;
  }
  
  return data;
};

// Batch write function
const batchWrite = async (collectionName: string, data: any[]) => {
  const batch = writeBatch(db);
  
  data.forEach(item => {
    const cleanedItem = cleanDataForFirestore(item);
    const docRef = doc(collection(db, collectionName), cleanedItem.id);
    batch.set(docRef, cleanedItem);
  });
  
  await batch.commit();
  console.log(`✅ ${data.length} ${collectionName} documents written`);
};

// Individual document write function
const writeDocument = async (collectionName: string, id: string, data: any) => {
  const cleanedData = cleanDataForFirestore(data);
  const docRef = doc(collection(db, collectionName), id);
  await setDoc(docRef, cleanedData);
  console.log(`✅ ${collectionName}/${id} written`);
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Check environment variables
    if (!firebaseConfig.projectId) {
      throw new Error('Firebase project ID is not configured. Check your environment variables.');
    }
    
    console.log(`📊 Project: ${firebaseConfig.projectId}`);
    console.log(`📊 Configuration:`, seedConfig);
    console.log('');
    
    // Generate seed data
    console.log('🔄 Generating seed data...');
    const seedData = generateSeedData(seedConfig);
    const counts = getSeedDataCounts(seedData);
    
    console.log('📈 Generated data counts:');
    console.log(`   Users: ${counts.users}`);
    console.log(`   Capsules: ${counts.capsules}`);
    console.log(`   Content: ${counts.content}`);
    console.log(`   Notifications: ${counts.notifications}`);
    console.log(`   Analytics: ${counts.analytics}`);
    console.log('');
    
    // Write system configuration first
    console.log('⚙️  Writing system configuration...');
    await writeDocument('system', 'config', seedData.systemConfig);
    
    // Write users
    console.log('👥 Writing users...');
    await batchWrite('users', seedData.users);
    
    // Write capsules
    console.log('📦 Writing capsules...');
    await batchWrite('capsules', seedData.capsules);
    
    // Write content
    console.log('📄 Writing content...');
    await batchWrite('content', seedData.content);
    
    // Write notifications
    if (seedData.notifications.length > 0) {
      console.log('🔔 Writing notifications...');
      await batchWrite('notifications', seedData.notifications);
    }
    
    // Write analytics
    if (seedData.analytics.length > 0) {
      console.log('📊 Writing analytics...');
      await batchWrite('analytics', seedData.analytics);
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   Total documents written: ${Object.values(counts).reduce((a, b) => a + b, 0) + 1}`);
    console.log(`   Users: ${counts.users}`);
    console.log(`   Capsules: ${counts.capsules}`);
    console.log(`   Content: ${counts.content}`);
    console.log(`   Notifications: ${counts.notifications}`);
    console.log(`   Analytics: ${counts.analytics}`);
    console.log(`   System Config: 1`);
    
    console.log('\n🚀 You can now start your development server: npm run dev');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Clear database function (for development)
const clearDatabase = async () => {
  try {
    console.log('🗑️  Clearing database...');
    
    const collections = ['users', 'capsules', 'content', 'notifications', 'analytics', 'system'];
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      const batch = writeBatch(db);
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Cleared ${collectionName} collection`);
    }
    
    console.log('🎉 Database cleared successfully!');
    
  } catch (error) {
    console.error('❌ Clearing failed:', error);
    process.exit(1);
  }
};

// Command line interface
const main = async () => {
  const command = process.argv[2];
  
  switch (command) {
    case 'clear':
      await clearDatabase();
      break;
    case 'seed':
    default:
      await seedDatabase();
      break;
  }
};

// Run the script
if (require.main === module) {
  main();
}

export { seedDatabase, clearDatabase };
