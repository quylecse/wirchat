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

  fetchMe: async (token?: string | null): Promise<User> => {
    const headers: Record<string, string> = {};
    // Wenn ein Token direkt übergeben wird, verwende es für den Header.
    // Dies ist entscheidend, um die Race Condition nach dem Anmelden zu beheben.
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await api.get("/user/me", { headers, withCredentials: true });
    return res.data.user; // Korrektur: Das Benutzerobjekt aus der Antwort extrahieren
  },
};
