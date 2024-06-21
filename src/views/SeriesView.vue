<template>
    <div class="series">
      <h1>Popular Series</h1>
      <div class="series-list" v-if="series.length">
        <div class="series-item" v-for="serie in series" :key="serie.id">
          <router-link :to="'/series/' + serie.id">
            <img :src="getImageUrl(serie.poster_path)" alt="Series Poster" />
            <p>{{ serie.name }}</p>
            <p>{{ formatPrice(serie.price) }}</p>
          </router-link>
          <div v-if="isAdmin">
            <button class="edit-button" @click="editSeries(serie.id)">Alterar</button>
            <button class="delete-button" @click="deleteSeries(serie.id)">Eliminar</button>
          </div>
          <div v-else>
            <button class="favorite-button" @click="toggleFavorite(serie)">
              {{ isFavorite(serie) ? 'Unfavorite' : 'Favorite' }}
            </button>
            <button class="cart-button" @click="addToCart(serie)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import tmdb from '@/tmdb';
  import { useFavoritesStore } from '@/stores/favorites';
  import { useCartStore } from '@/stores/cart';
  import { useAuthStore } from '@/stores/auth';
  import { db } from '@/firebase';
  import { doc, deleteDoc } from 'firebase/firestore';
  
  export default {
    setup() {
      const favoritesStore = useFavoritesStore();
      const cartStore = useCartStore();
      const authStore = useAuthStore();
      const router = useRouter();
      const series = ref([]);
  
      const toggleFavorite = (serie) => {
        favoritesStore.toggleFavorite(serie);
      };
  
      const isFavorite = (serie) => {
        return favoritesStore.isFavorite(serie);
      };
  
      const addToCart = (serie) => {
        cartStore.addItem(serie);
      };
  
      const editSeries = (id) => {
        router.push(`/admin/edit/${id}`);
      };
  
      const deleteSeries = async (id) => {
        try {
          await deleteDoc(doc(db, 'series', id));
          series.value = series.value.filter(serie => serie.id !== id);
        } catch (error) {
          console.error("Error deleting series:", error);
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
        series.value = response.data.results.map(serie => ({
          ...serie,
          price: (Math.random() * (20 - 5) + 5).toFixed(2)
        }));
      });
  
      return {
        series,
        toggleFavorite,
        isFavorite,
        addToCart,
        editSeries,
        deleteSeries,
        isAdmin: authStore.isAdmin,
        getImageUrl,
        formatPrice
      };
    }
  };
  </script>
  
  <style scoped>
  .series {
    padding: 2rem;
  }
  .series-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .series-item {
    flex: 1 0 21%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .series-item img {
    width: 100%;
    border-radius: 10px;
  }
  .series-item p {
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
  