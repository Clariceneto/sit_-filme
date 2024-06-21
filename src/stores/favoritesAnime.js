import { defineStore } from 'pinia';
import { db } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth';

export const useFavoritesAnimeStore = defineStore('favoritesAnime', {
  state: () => ({
    favorites: []
  }),
  actions: {
    async fetchFavorites() {
      const authStore = useAuthStore();
      if (authStore.user) {
        const q = query(collection(db, 'favorites_anime'), where('userId', '==', authStore.user.uid));
        const querySnapshot = await getDocs(q);
        this.favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    },
    async addFavorite(anime) {
      const authStore = useAuthStore();
      if (authStore.user) {
        const favoriteData = {
          userId: authStore.user.uid,
          animeId: anime.id,
          title: anime.title || anime.name || 'No Title',
          poster_path: anime.poster_path,
          overview: anime.overview,
          release_date: anime.release_date,
          price: anime.price
        };
        await addDoc(collection(db, 'favorites_anime'), favoriteData);
        this.favorites.push(favoriteData);
      }
    },
    async removeFavorite(animeId) {
      const authStore = useAuthStore();
      if (authStore.user) {
        const q = query(collection(db, 'favorites_anime'), where('userId', '==', authStore.user.uid), where('animeId', '==', animeId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, 'favorites_anime', docSnapshot.id));
          this.favorites = this.favorites.filter(favorite => favorite.animeId !== animeId);
        });
      }
    },
    isFavorite(anime) {
      return this.favorites.some(favorite => favorite.animeId === anime.id);
    },
    toggleFavorite(anime) {
      if (this.isFavorite(anime)) {
        this.removeFavorite(anime.id);
      } else {
        this.addFavorite(anime);
      }
    }
  }
});
