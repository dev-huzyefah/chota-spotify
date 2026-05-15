import type { User } from '@/shared/types/types';

export type AuthUser = User;

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  displayName: string;
}

