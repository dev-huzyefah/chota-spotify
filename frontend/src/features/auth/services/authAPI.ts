import type { AuthUser, AuthCredentials, SignupData } from '../types/authTypes';
import { userAPI } from '@/shared/services/api';

/**
 * Key used for storing auth data in localStorage.
 * Using 'authorization' as a better practice.
 */
const AUTH_KEY = 'authorization';

/**
 * Saves the authenticated user data to local storage
 */
export function saveSession(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

/**
 * Clears the auth data from local storage
 */
export function clearSession(): void {
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Retrieves the current session if it exists
 */
export function getSession(): AuthUser | null {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Registers a new user
 */
export async function signup(data: SignupData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const user = await userAPI.signup(data.email, data.password, data.displayName);
    saveSession(user);
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create account'
    };
  }
}

/**
 * Authenticates a user
 */
export async function login(creds: AuthCredentials): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const user = await userAPI.login(creds.email, creds.password);
    saveSession(user);
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
}

