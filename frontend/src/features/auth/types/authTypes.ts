import type { User } from '@/shared/types/types';

export type AuthUser = User;

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  displayName: string;
}

/** Response from POST /login and POST /signup */
export interface AuthResponse extends User {
  access: string;
  refresh: string;
}

export interface AuthSession {
  user: AuthUser;
  access: string;
  refresh: string;
}
