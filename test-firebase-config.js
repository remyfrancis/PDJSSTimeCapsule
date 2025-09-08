// Test Firebase configuration loading
console.log('Testing Firebase configuration...');

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('\nEnvironment Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
  if (value) {
    console.log(`  Value: ${value.substring(0, 10)}...`);
  }
});

// Test Firebase initialization
try {
  const { initializeApp } = require('firebase/app');
  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  console.log('\nFirebase Config Object:');
  console.log(JSON.stringify(firebaseConfig, null, 2));

  const app = initializeApp(firebaseConfig);
  console.log('\n✅ Firebase initialized successfully!');
  console.log('App name:', app.name);
  
} catch (error) {
  console.error('\n❌ Firebase initialization failed:');
  console.error(error.message);
}
