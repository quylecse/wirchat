import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const loading = useAuthStore((state) => state.loading);
  const refresh = useAuthStore((state) => state.refresh);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Diese Funktion wird nur einmal beim ersten Laden der App ausgeführt.
    // Sie versucht, die Sitzung über das Refresh-Token wiederherzustellen.
    const initializeAuth = async () => {
      try {
        // Versuche immer, die Sitzung beim ersten Laden zu aktualisieren.
        // Wenn der Refresh-Token gültig ist, werden Token und Benutzer aktualisiert.
        // Wenn nicht, wird ein Fehler ausgelöst und abgefangen.
        await refresh();
      } catch (error) {
        console.log(error);
        // Wenn das Aktualisieren fehlschlägt, ist das in Ordnung.
        // Der Benutzer ist einfach nicht angemeldet.
        console.log("Sitzung konnte nicht wiederhergestellt werden.");
      } finally {
        // Markiere die Initialisierung als abgeschlossen.
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []); // Leeres Abhängigkeitsarray, um sicherzustellen, dass dies nur einmal beim Mounten ausgeführt wird.

  // Zeige einen Ladebildschirm an, während die App initialisiert wird oder eine andere Ladeaktion läuft.
  if (isInitializing || loading) {
    return (
      <div className="flex h-screen items-center justify-center">lädt...</div>
    );
  }

  // Wenn die Initialisierung abgeschlossen ist und immer noch kein Token vorhanden ist, leite zum Anmelden weiter.
  if (!accessToken) {
    return <Navigate to="/signin" replace></Navigate>;
  }

  // Wenn ein Token vorhanden ist, zeige die geschützte Seite an.
  return <Outlet />;
};

export default ProtectedRoute;
