import { defineStore } from 'pinia';
import { db } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: []
  }),
  actions: {
    async fetchFavorites() {
      const authStore = useAuthStore();
      if (authStore.user) {
        const q = query(collection(db, 'favorites'), where('userId', '==', authStore.user.uid));
        const querySnapshot = await getDocs(q);
        this.favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    },
    async addFavorite(item) {
      const authStore = useAuthStore();
      if (authStore.user) {
        const favoriteData = {
          userId: authStore.user.uid,
          movieId: item.id,
          title: item.title || item.name || 'No Title', // Ensuring the title is defined
          poster_path: item.poster_path,
          overview: item.overview,
          release_date: item.release_date,
          price: item.price
        };
        await addDoc(collection(db, 'favorites'), favoriteData);
        this.favorites.push(favoriteData);
      }
    },
    async removeFavorite(itemId) {
      const authStore = useAuthStore();
      if (authStore.user) {
        const q = query(collection(db, 'favorites'), where('userId', '==', authStore.user.uid), where('movieId', '==', itemId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, 'favorites', docSnapshot.id));
          this.favorites = this.favorites.filter(favorite => favorite.movieId !== itemId);
        });
      }
    },
    isFavorite(item) {
      return this.favorites.some(favorite => favorite.movieId === item.id);
    },
    toggleFavorite(item) {
      if (this.isFavorite(item)) {
        this.removeFavorite(item.id);
      } else {
        this.addFavorite(item);
      }
    }
  }
});
