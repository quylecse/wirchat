import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authServices';
import type { AuthState } from '@/types/store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    signUp: async (data) => {
        try {
            set({ loading: true });
            // API aufruffen from Services
            await authService.signUp(data.username, data.password, data.email, data.firstName, data.lastName);

            toast.success('Registrierung erfolgreich! Sie werden nun zur Anmeldeseite weitergeleitet.');
        } catch (error) {
            console.log(error);
            toast.error('Konto-Registrierung fehlgeschlagen.');
            // Wirf den Fehler erneut, damit die Komponente darauf reagieren kann
            throw error;
        } finally {
            set({ loading: false });
        }
    }
}));