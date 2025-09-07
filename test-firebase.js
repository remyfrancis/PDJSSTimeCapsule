// Test Firebase connection
const { initializeApp } = require('firebase/app');
const { getAuth, connectAuthEmulator } = require('firebase/auth');
const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');
const { getStorage, connectStorageEmulator } = require('firebase/storage');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testFirebaseConnection() {
  try {
    console.log('🔥 Testing Firebase connection...\n');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log(`API Key: ${firebaseConfig.apiKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`Auth Domain: ${firebaseConfig.authDomain ? '✅ Set' : '❌ Missing'}`);
    console.log(`Project ID: ${firebaseConfig.projectId ? '✅ Set' : '❌ Missing'}`);
    console.log(`Storage Bucket: ${firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing'}`);
    console.log(`Messaging Sender ID: ${firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing'}`);
    console.log(`App ID: ${firebaseConfig.appId ? '✅ Set' : '❌ Missing'}\n`);
    
    // Initialize Firebase
    console.log('🚀 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully\n');
    
    // Test Auth
    console.log('🔐 Testing Firebase Auth...');
    const auth = getAuth(app);
    console.log('✅ Firebase Auth initialized successfully\n');
    
    // Test Firestore
    console.log('📊 Testing Firestore...');
    const db = getFirestore(app);
    console.log('✅ Firestore initialized successfully\n');
    
    // Test Storage
    console.log('💾 Testing Firebase Storage...');
    const storage = getStorage(app);
    console.log('✅ Firebase Storage initialized successfully\n');
    
    console.log('🎉 All Firebase services are working correctly!');
    console.log('\n📝 Next steps:');
    console.log('1. Deploy Firestore rules: firebase deploy --only firestore:rules');
    console.log('2. Deploy Firestore indexes: firebase deploy --only firestore:indexes');
    console.log('3. Start your Next.js app: npm run dev');
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env.local file has all required Firebase config');
    console.log('2. Verify your Firebase project is active');
    console.log('3. Make sure firebase package is installed: npm install firebase');
  }
}

// Run the test
testFirebaseConnection();
