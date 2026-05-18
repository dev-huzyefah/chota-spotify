import type {
  AuthCredentials,
  AuthResponse,
  AuthSession,
  AuthUser,
  SignupData,
} from '../types/authTypes';
import { userAPI } from '@/shared/services/api';

const AUTH_KEY = 'authorization';

export function saveSession(response: AuthResponse): AuthUser {
  const { access, refresh, ...user } = response;
  const session: AuthSession = {
    user: user as AuthUser,
    access,
    refresh,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session.user;
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function getSession(): AuthUser | null {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as AuthSession | AuthUser;
    if ('user' in parsed && parsed.user) {
      return parsed.user;
    }
    return parsed as AuthUser;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as AuthSession | AuthUser;
    if ('access' in parsed && typeof parsed.access === 'string') {
      return parsed.access;
    }
    return null;
  } catch {
    return null;
  }
}

export async function signup(
  data: SignupData,
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const response = await userAPI.signup(data.email, data.password, data.displayName);
    const user = saveSession(response);
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create account',
    };
  }
}

export async function login(
  creds: AuthCredentials,
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const response = await userAPI.login(creds.email, creds.password);
    const user = saveSession(response);
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}
