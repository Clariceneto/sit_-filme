import { defineStore } from 'pinia';
import { db } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth';

export const useFavoritesSeriesStore = defineStore('favoritesSeries', {
  state: () => ({
    favorites: []
  }),
  actions: {
    async fetchFavorites() {
      const authStore = useAuthStore();
      if (authStore.user) {
        const q = query(collection(db, 'favorites_series'), where('userId', '==', authStore.user.uid));
        const querySnapshot = await getDocs(q);
        this.favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    },
    async addFavorite(series) {
      const authStore = useAuthStore();
      if (authStore.user) {
        const favoriteData = {
          userId: authStore.user.uid,
          seriesId: series.id,
          title: series.title || series.name || 'No Title',
          poster_path: series.poster_path,
          overview: series.overview,
          release_date: series.release_date,
          price: series.price
        };
        await addDoc(collection(db, 'favorites_series'), favoriteData);
        this.favorites.push(favoriteData);
      }
    },
    async removeFavorite(seriesId) {
      const authStore = useAuthStore();
      if (authStore.user) {
        const q = query(collection(db, 'favorites_series'), where('userId', '==', authStore.user.uid), where('seriesId', '==', seriesId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, 'favorites_series', docSnapshot.id));
          this.favorites = this.favorites.filter(favorite => favorite.seriesId !== seriesId);
        });
      }
    },
    isFavorite(series) {
      return this.favorites.some(favorite => favorite.seriesId === series.id);
    },
    toggleFavorite(series) {
      if (this.isFavorite(series)) {
        this.removeFavorite(series.id);
      } else {
        this.addFavorite(series);
      }
    }
  }
});
