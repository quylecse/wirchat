import api from "@/lib/axios";
import type { AuthState } from "@/types/store";
import type { User } from "@/types/user";

// Definiere die Typen für die Daten, die an die API gesendet werden
type SignUpData = Parameters<AuthState["signUp"]>[0];
type SignInData = Parameters<AuthState["signIn"]>[0];

export const authService = {
  // Akzeptiert ein einzelnes Datenobjekt, genau wie der Store
  signUp: async (data: SignUpData): Promise<void> => {
    await api.post("/auth/signup", data, { withCredentials: true });
  },

  // Akzeptiert ein einzelnes Datenobjekt und gibt ein Promise mit dem Access-Token zurück
  signIn: async (data: SignInData): Promise<{ accessToken: string }> => {
    const res = await api.post("/auth/signin", data, {
      withCredentials: true,
    });
    return res.data;
  },

  signOut: async (): Promise<void> => {
    await api.post("/auth/signout", {}, { withCredentials: true });
  },

  fetchMe: async (): Promise<User> => {
    const res = await api.get("/user/me", { withCredentials: true });
    return res.data.user;
  },
  refresh: async (): Promise<{ accessToken: string; user: User }> => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    return res.data;
  },
};
