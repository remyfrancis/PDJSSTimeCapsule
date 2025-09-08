import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserSchema, CreateUserInputSchema } from '@/lib/validation/user';
import type { UserValidation, CreateUserInputValidation } from '@/lib/validation/user';

export interface CreateUserData {
  uid: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  role?: 'user' | 'admin' | 'super_admin';
  permissions?: string[];
}

export class UserService {
  /**
   * Create a new user document in Firestore
   */
  static async createUser(userData: CreateUserData): Promise<UserValidation> {
    try {
      // Validate input data
      const validatedData = CreateUserInputSchema.parse({
        email: userData.email,
        displayName: userData.displayName,
        profilePicture: userData.profilePicture,
      });

      // Create user document
      const userDoc = {
        id: userData.uid,
        email: validatedData.email,
        displayName: validatedData.displayName,
        profilePicture: validatedData.profilePicture,
        lastActive: serverTimestamp(),
        isEmailVerified: false,
        accountStatus: 'active' as const,
        role: userData.role || 'user',
        permissions: userData.permissions || [],
        preferences: {
          emailNotifications: true,
          theme: 'light' as const,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Validate the complete user document
      const validatedUser = UserSchema.parse(userDoc);

      // Save to Firestore
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, validatedUser);

      console.log(`✅ User created: ${userData.uid}`);
      return validatedUser;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user by ID
   */
  static async getUser(uid: string): Promise<UserValidation | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        return UserSchema.parse(userData);
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      throw new Error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update user's last active timestamp
   */
  static async updateLastActive(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        lastActive: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('❌ Error updating last active:', error);
      // Don't throw error for this non-critical operation
    }
  }

  /**
   * Update user role and permissions
   */
  static async updateUserRole(uid: string, role: 'user' | 'admin' | 'super_admin', permissions: string[] = []): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role,
        permissions,
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ User role updated: ${uid} -> ${role}`);
    } catch (error) {
      console.error('❌ Error updating user role:', error);
      throw new Error(`Failed to update user role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if user is admin
   */
  static async isAdmin(uid: string): Promise<boolean> {
    try {
      const user = await this.getUser(uid);
      return user ? ['admin', 'super_admin'].includes(user.role) : false;
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Get admin permissions for a user
   */
  static async getAdminPermissions(uid: string): Promise<string[]> {
    try {
      const user = await this.getUser(uid);
      return user?.permissions || [];
    } catch (error) {
      console.error('❌ Error getting admin permissions:', error);
      return [];
    }
  }
}
