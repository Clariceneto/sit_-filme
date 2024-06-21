<template>
    <div class="anime">
      <h1>Popular Anime</h1>
      <div class="anime-list" v-if="animes.length">
        <div class="anime-item" v-for="anime in animes" :key="anime.id">
          <router-link :to="'/anime/' + anime.id">
            <img :src="getImageUrl(anime.poster_path)" alt="Anime Poster" />
            <p>{{ anime.name }}</p>
            <p>{{ formatPrice(anime.price) }}</p>
          </router-link>
          <div v-if="isAdmin">
            <button class="edit-button" @click="editAnime(anime.id)">Alterar</button>
            <button class="delete-button" @click="deleteAnime(anime.id)">Eliminar</button>
          </div>
          <div v-else>
            <button class="favorite-button" @click="toggleFavorite(anime)">
              {{ isFavorite(anime) ? 'Unfavorite' : 'Favorite' }}
            </button>
            <button class="cart-button" @click="addToCart(anime)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import tmdb from '@/tmdb';
  import { useFavoritesAnimeStore } from '@/stores/favoritesAnime';
  import { useCartStore } from '@/stores/cart';
  import { useAuthStore } from '@/stores/auth';
  import { db } from '@/firebase';
  import { doc, deleteDoc } from 'firebase/firestore';
  
  export default {
    setup() {
      const favoritesStore = useFavoritesAnimeStore();
      const cartStore = useCartStore();
      const authStore = useAuthStore();
      const router = useRouter();
      const animes = ref([]);
  
      const toggleFavorite = (anime) => {
        favoritesStore.toggleFavorite(anime);
      };
  
      const isFavorite = (anime) => {
        return favoritesStore.isFavorite(anime);
      };
  
      const addToCart = (anime) => {
        cartStore.addItem(anime);
      };
  
      const editAnime = (id) => {
        router.push(`/admin/edit/${id}`);
      };
  
      const deleteAnime = async (id) => {
        try {
          await deleteDoc(doc(db, 'anime', id));
          animes.value = animes.value.filter(anime => anime.id !== id);
        } catch (error) {
          console.error("Error deleting anime:", error);
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
        const response = await tmdb.get('/tv/popular', {
          params: {
            with_genres: '16' // Anime genre ID in TMDB is 16
          }
        });
        animes.value = response.data.results.map(anime => ({
          ...anime,
          price: (Math.random() * (20 - 5) + 5).toFixed(2)
        }));
      });
  
      return {
        animes,
        toggleFavorite,
        isFavorite,
        addToCart,
        editAnime,
        deleteAnime,
        isAdmin: authStore.isAdmin,
        getImageUrl,
        formatPrice
      };
    }
  };
  </script>
  
  <style scoped>
  .anime {
    padding: 2rem;
  }
  .anime-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .anime-item {
    flex: 1 0 21%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .anime-item img {
    width: 100%;
    border-radius: 10px;
  }
  .anime-item p {
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
  