import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

console.log('🔍 Firebase Configuration Check');
console.log('Environment:', process.env.NODE_ENV);
console.log('Development mode:', isDevelopment);

// Required environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('\n📋 Environment Variables Status:');
let allVarsPresent = true;
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  console.log(`${status} ${key}: ${value ? 'Set' : 'Missing'}`);
  if (!value) allVarsPresent = false;
});

if (!allVarsPresent) {
  console.error('\n❌ Missing required environment variables!');
  console.error('Please check your .env.local file in the pdjss-timecapsule directory.');
  console.error('\nRequired variables:');
  Object.keys(requiredEnvVars).forEach(key => {
    console.error(`  NEXT_PUBLIC_${key.toUpperCase()}`);
  });
  process.exit(1);
}

// Initialize Firebase
try {
  console.log('\n🚀 Initializing Firebase...');
  const app = initializeApp(requiredEnvVars);
  console.log('✅ Firebase app initialized successfully');
  console.log('App name:', app.name);
  console.log('Project ID:', app.options.projectId);

  // Initialize Auth
  console.log('\n🔐 Initializing Firebase Auth...');
  const auth = getAuth(app);
  console.log('✅ Firebase Auth initialized successfully');
  console.log('Auth app name:', auth.app.name);

  // Initialize Firestore
  console.log('\n📊 Initializing Firestore...');
  const db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
  console.log('Firestore app name:', db.app.name);

  // Check if we should connect to emulators
  if (isDevelopment && process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === 'true') {
    console.log('\n🔧 Connecting to Firebase Emulators...');
    
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      console.log('✅ Auth emulator connected');
    } catch (error) {
      console.log('⚠️  Auth emulator connection failed (may already be connected)');
    }

    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('✅ Firestore emulator connected');
    } catch (error) {
      console.log('⚠️  Firestore emulator connection failed (may already be connected)');
    }
  }

  console.log('\n🎉 Firebase setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Make sure Firebase Authentication is enabled in your Firebase Console');
  console.log('2. Enable Email/Password authentication in Authentication > Sign-in method');
  console.log('3. If using emulators, make sure they are running: firebase emulators:start');

} catch (error) {
  console.error('\n❌ Firebase initialization failed:');
  console.error('Error:', error.message);
  console.error('\nTroubleshooting steps:');
  console.error('1. Check your Firebase project configuration');
  console.error('2. Verify environment variables are correctly set');
  console.error('3. Make sure Firebase project exists and is active');
  console.error('4. Check Firebase Console for any project issues');
  process.exit(1);
}
