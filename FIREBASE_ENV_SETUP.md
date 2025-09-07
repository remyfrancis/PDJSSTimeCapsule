# Firebase Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Client-Side Firebase Config (NEXT*PUBLIC* prefix)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Server-Side Firebase Admin SDK (NO NEXT*PUBLIC* prefix)

```env
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=your_client_id
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your_project_id.iam.gserviceaccount.com
```

## How to Get These Values

### 1. Client-Side Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on your web app or create one
6. Copy the config object values

### 2. Admin SDK Config

1. In Firebase Console, go to Project Settings
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Extract the values from the JSON and add them to your .env.local

## Important Notes

- **NEXT*PUBLIC* prefix**: Variables with this prefix are exposed to the client-side and should only contain non-sensitive configuration
- **Server-side variables**: Variables without NEXT*PUBLIC* are only available on the server and should contain sensitive data like private keys
- **Never commit .env.local**: This file is already in your .gitignore
- **Deployment**: For Vercel deployment, add these same variables in your Vercel project settings

## Example Usage in Code

### Client-Side (Firebase SDK)

```typescript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
```

### Server-Side (Admin SDK)

```typescript
import { initializeApp, cert } from "firebase-admin/app";

const adminApp = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_ADMIN_CLIENT_ID,
    authUri: process.env.FIREBASE_ADMIN_AUTH_URI,
    tokenUri: process.env.FIREBASE_ADMIN_TOKEN_URI,
    authProviderX509CertUrl:
      process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  }),
});
```
