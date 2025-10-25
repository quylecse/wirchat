import { create } from "zustand";
import { toast } from "sonner";
import axios from "axios";
import { authService } from "@/services/authServices";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (data) => {
    try {
      set({ loading: true });
      await authService.signUp(data);

      toast.success(
        "Registrierung erfolgreich! Sie werden nun zur Anmeldeseite weitergeleitet."
      );
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Konto-Registrierung fehlgeschlagen.");
      }
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (data) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.signIn(data);
      set({ accessToken });
      // Übergebe den neuen Token direkt an fetchMe, um Race Conditions zu vermeiden
      await get().fetchMe(accessToken);
      toast.success("Herzlich wilkommen");
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Anmeldung nicht erfolgreich");
      }
      // Wirf den Fehler erneut, damit die aufrufende Komponente (z. B. das Formular) darauf reagieren kann.
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      // Lösche den Zustand sofort für eine schnellere UI-Reaktion
      get().clearState();
      await authService.signOut();
      toast.success("Abmeldung erfolgreich");
    } catch (error) {
      console.log(error);
      toast.error("Abmeldung Fehler");
      throw error;
    }
  },
  // Akzeptiert optional einen Token, um ihn sofort zu verwenden
  fetchMe: async (token) => {
    try {
      const user = await authService.fetchMe(token);
      set({ user, accessToken: token || get().accessToken || "restored" });
    } catch (error) {
      console.log(error);
      // Setze nur den Benutzer zurück, lösche nicht den gerade erhaltenen Token
      set({ user: null });
      throw error;
    }
  },
}));
