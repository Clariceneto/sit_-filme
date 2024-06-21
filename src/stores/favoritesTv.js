import { defineStore } from 'pinia';
import { db } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth';

export const useFavoritesTvStore = defineStore('favoritesTv', {
  state: () => ({
    favorites: []
  }),
  actions: {
    async fetchFavorites() {
      const authStore = useAuthStore();
      if (authStore.user) {
        const q = query(collection(db, 'favorites_tv'), where('userId', '==', authStore.user.uid));
        const querySnapshot = await getDocs(q);
        this.favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    },
    async addFavorite(tv) {
      const authStore = useAuthStore();
      if (authStore.user) {
        const favoriteData = {
          userId: authStore.user.uid,
          tvId: tv.id,
          title: tv.title || tv.name || 'No Title',
          poster_path: tv.poster_path,
          overview: tv.overview,
          release_date: tv.release_date,
          price: tv.price
        };
        await addDoc(collection(db, 'favorites_tv'), favoriteData);
        this.favorites.push(favoriteData);
      }
    },
    async removeFavorite(tvId) {
      const authStore = useAuthStore();
      if (authStore.user) {
        const q = query(collection(db, 'favorites_tv'), where('userId', '==', authStore.user.uid), where('tvId', '==', tvId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, 'favorites_tv', docSnapshot.id));
          this.favorites = this.favorites.filter(favorite => favorite.tvId !== tvId);
        });
      }
    },
    isFavorite(tv) {
      return this.favorites.some(favorite => favorite.tvId === tv.id);
    },
    toggleFavorite(tv) {
      if (this.isFavorite(tv)) {
        this.removeFavorite(tv.id);
      } else {
        this.addFavorite(tv);
      }
    }
  }
});
