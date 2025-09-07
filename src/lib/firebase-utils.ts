import { auth, db, storage } from './firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Authentication utilities
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// User profile utilities
export const createUserProfile = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userData = {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: Timestamp.now(),
    lastActive: Timestamp.now(),
  };
  
  await setDoc(userRef, userData);
  return userData;
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
};

// Capsule utilities
export const createCapsule = async (capsuleData: {
  title: string;
  description: string;
  unlockDate: Date;
  tags: string[];
  userId: string;
}) => {
  const capsuleRef = await addDoc(collection(db, 'capsules'), {
    ...capsuleData,
    unlockDate: Timestamp.fromDate(capsuleData.unlockDate),
    createdAt: Timestamp.now(),
    isSealed: false,
    isOpened: false,
    contentCount: 0,
  });
  
  return capsuleRef.id;
};

export const getUserCapsules = async (userId: string) => {
  const capsulesRef = collection(db, 'capsules');
  const q = query(
    capsulesRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const sealCapsule = async (capsuleId: string) => {
  const capsuleRef = doc(db, 'capsules', capsuleId);
  await updateDoc(capsuleRef, {
    isSealed: true,
  });
};

export const deleteCapsule = async (capsuleId: string) => {
  const capsuleRef = doc(db, 'capsules', capsuleId);
  await deleteDoc(capsuleRef);
};

// Content utilities
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const deleteFile = async (path: string) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

export const addContentToCapsule = async (capsuleId: string, contentData: {
  type: 'text' | 'image' | 'video' | 'audio' | 'document';
  data: any;
  order: number;
}) => {
  const contentRef = await addDoc(collection(db, 'content'), {
    ...contentData,
    capsuleId,
    createdAt: Timestamp.now(),
  });
  
  // Update capsule content count
  const capsuleRef = doc(db, 'capsules', capsuleId);
  const capsuleSnap = await getDoc(capsuleRef);
  if (capsuleSnap.exists()) {
    const currentCount = capsuleSnap.data().contentCount || 0;
    await updateDoc(capsuleRef, {
      contentCount: currentCount + 1,
    });
  }
  
  return contentRef.id;
};

export const getCapsuleContent = async (capsuleId: string) => {
  const contentRef = collection(db, 'content');
  const q = query(
    contentRef,
    where('capsuleId', '==', capsuleId),
    orderBy('order', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

