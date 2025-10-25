import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Hole den Token aus dem Zustand zum Zeitpunkt der Anfrage
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("/auth/signin") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Prüfe, ob der Fehler ein 403-Fehler ist und ob wir es nicht schon einmal versucht haben.
    // originalRequest._isRetry verhindert eine Endlosschleife.
    if (error.response?.status === 403 && !originalRequest._isRetry) {
      originalRequest._isRetry = true; // Markiere die Anfrage, um ein erneutes Versuchen zu verhindern.

      // Versuche, den Token zu erneuern
      try {
        // Die /refresh Route gibt sowohl accessToken als auch user zurück
        const { data } = await api.post("/auth/refresh");
        const { accessToken, user } = data;

        // Aktualisiere den Zustand im Store mit den neuen Daten
        useAuthStore.getState().setAccessToken(accessToken);
        // Es wäre gut, eine setUser-Methode im Store zu haben, aber set({ user }) funktioniert auch.
        useAuthStore.setState({ user });

        // Aktualisiere den Header der ursprünglichen Anfrage und versuche es erneut
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Wenn die Aktualisierung fehlschlägt, lösche den Zustand und melde den Benutzer ab
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
