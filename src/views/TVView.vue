<template>
    <div class="tv">
      <h1>Popular TV Shows</h1>
      <div class="tv-list" v-if="tvShows.length">
        <div class="tv-show" v-for="tv in tvShows" :key="tv.id">
          <router-link :to="'/tv/' + tv.id">
            <img :src="getImageUrl(tv.poster_path)" alt="TV Show Poster" />
            <p>{{ tv.name }}</p>
            <p>{{ formatPrice(tv.price) }}</p>
          </router-link>
          <div v-if="isAdmin">
            <button class="edit-button" @click="editTVShow(tv.id)">Alterar</button>
            <button class="delete-button" @click="deleteTVShow(tv.id)">Eliminar</button>
          </div>
          <div v-else>
            <button class="favorite-button" @click="toggleFavorite(tv)">
              {{ isFavorite(tv) ? 'Unfavorite' : 'Favorite' }}
            </button>
            <button class="cart-button" @click="addToCart(tv)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import tmdb from '@/tmdb';
  import { useFavoritesTvStore } from '@/stores/favoritesTv';
  import { useCartStore } from '@/stores/cart';
  import { useAuthStore } from '@/stores/auth';
  import { db } from '@/firebase';
  import { doc, deleteDoc } from 'firebase/firestore';
  
  export default {
    setup() {
      const favoritesStore = useFavoritesTvStore();
      const cartStore = useCartStore();
      const authStore = useAuthStore();
      const router = useRouter();
      const tvShows = ref([]);
  
      const toggleFavorite = (tv) => {
        favoritesStore.toggleFavorite(tv);
      };
  
      const isFavorite = (tv) => {
        return favoritesStore.isFavorite(tv);
      };
  
      const addToCart = (tv) => {
        cartStore.addItem(tv);
      };
  
      const editTVShow = (id) => {
        router.push(`/admin/edit/${id}`);
      };
  
      const deleteTVShow = async (id) => {
        try {
          await deleteDoc(doc(db, 'tv', id));
          tvShows.value = tvShows.value.filter(tv => tv.id !== id);
        } catch (error) {
          console.error("Error deleting TV show:", error);
        }
      };
  
      const getImageUrl = (path) => {
        return `https://image.tmdb.org/t/p/w500${path}`;
      };
  
      const formatPrice = (price) => {
        return `$${price}`;
      };
  
      onMounted(async () => {
        await favoritesStore.fetchFavorites();
        const response = await tmdb.get('/tv/popular');
        tvShows.value = response.data.results.map(tv => ({
          ...tv,
          price: (Math.random() * (20 - 5) + 5).toFixed(2)
        }));
      });
  
      return {
        tvShows,
        toggleFavorite,
        isFavorite,
        addToCart,
        editTVShow,
        deleteTVShow,
        isAdmin: authStore.isAdmin,
        getImageUrl,
        formatPrice
      };
    }
  };
  </script>
  
  <style scoped>
  .tv {
    padding: 2rem;
  }
  .tv-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .tv-show {
    flex: 1 0 21%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tv-show img {
    width: 100%;
    border-radius: 10px;
  }
  .tv-show p {
    margin-top: 0.5rem;
    color: white;
  }
  button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    border: none;
    color: white;
  }
  button:hover {
    transform: scale(1.05);
  }
  button.favorite-button {
    background-color: #ff9900;
  }
  button.favorite-button:hover {
    background-color: #cc7a00;
  }
  button.cart-button {
    background-color: #4caf50;
  }
  button.cart-button:hover {
    background-color: #388e3c;
  }
  button.edit-button {
    background-color: #4caf50;
  }
  button.edit-button:hover {
    background-color: #388e3c;
  }
  button.delete-button {
    background-color: #e50914;
  }
  button.delete-button:hover {
    background-color: #d40812;
  }
  </style>
  