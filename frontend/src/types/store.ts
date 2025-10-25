import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  clearState: () => void;

  signUp: (data: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;

  signIn: (data: { username: string; password: string }) => Promise<void>;

  signOut: () => Promise<void>;
  fetchMe: (token?: string | null) => Promise<void>;
}
