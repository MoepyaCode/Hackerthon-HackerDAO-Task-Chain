import type { User, UserProfile } from '@/@types';

// Mock API service - replace with actual API calls later
export class UserService {
  static async getCurrentUser(): Promise<User | null> {
    // TODO: Implement actual API call
    return null;
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    // TODO: Implement actual API call
    return null;
  }

  static async updateUser(userId: string, data: Partial<User>): Promise<User> {
    // TODO: Implement actual API call
    throw new Error('Not implemented');
  }

  static async linkWallet(userId: string, walletAddress: string): Promise<User> {
    // TODO: Implement actual API call
    throw new Error('Not implemented');
  }
}
