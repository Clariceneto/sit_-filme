import { defineStore } from 'pinia';
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        this.user = user;
      });
    },
    async logout() {
      try {
        await signOut(auth);
        this.user = null;
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  },
  getters: {
    isAdmin(state) {
      return state.user && state.user.email === 'admin12@gmail.com';
    }
  }
});
