# Digital Time Capsule - Firebase Setup

This project is a Next.js application for creating and managing digital time capsules with Firebase integration.

## Features

- 🔐 Google Authentication with Firebase Auth
- 📦 Firestore database for capsule and content storage
- 📁 Firebase Storage for file uploads
- ⏰ Time-locked capsule system
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Google provider)
3. Create a Firestore database
4. Set up Firebase Storage
5. Create a web app in your Firebase project

### 3. Environment Variables

Create a `.env.local` file in the project root with your Firebase configuration:

```env
# Client-Side Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server-Side Firebase Admin SDK
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

See `FIREBASE_ENV_SETUP.md` for detailed instructions on getting these values.

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── capsules/      # Capsule API endpoints
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Client-side Firebase config
│   ├── firebase-admin.ts  # Server-side Firebase config
│   ├── firebase-utils.ts  # Firebase utility functions
│   └── hooks/             # React hooks
│       └── useAuth.ts     # Authentication hook
```

## Firebase Services Used

- **Authentication**: Google sign-in for user management
- **Firestore**: Database for capsules, content, and user profiles
- **Storage**: File storage for images, videos, and documents
- **Admin SDK**: Server-side operations and token verification

## Development

The project includes:

- **Client-side Firebase**: For authentication and real-time data
- **Server-side Firebase Admin**: For secure API operations
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern styling
- **Next.js 15**: Latest features with App Router

## Deployment

This project is configured for deployment on Vercel. Make sure to:

1. Add all environment variables to your Vercel project settings
2. Configure Firebase project settings for production
3. Set up proper security rules in Firestore and Storage

## Security Rules

Make sure to configure proper security rules in your Firebase console:

- Firestore: Only allow authenticated users to access their own data
- Storage: Restrict file uploads to authenticated users
- Authentication: Enable only the providers you need

For detailed setup instructions, see `FIREBASE_ENV_SETUP.md`.
