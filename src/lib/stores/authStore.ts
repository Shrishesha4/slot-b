import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type User = {
  address: string;
  name?: string;
  email?: string;
  profileImage?: string;
  isVerified: boolean;
};

function createAuthStore() {
  const { subscribe, set, update } = writable<{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  return {
    subscribe,
    login: (user: User) => {
      if (browser) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      set({ user, isAuthenticated: true, isLoading: false });
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('user');
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
    },
    initialize: () => {
      if (browser) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      }
    }
  };
}

export const authStore = createAuthStore();

// Initialize the store when the app loads
if (browser) {
  authStore.initialize();
}