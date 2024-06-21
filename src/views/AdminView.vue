<template>
    <div v-if="isAdmin">
      <h1>Admin Panel</h1>
      <router-link to="/admin/edit">Add New Movie</router-link>
      <div class="movie-list" v-if="movies.length">
        <div class="movie" v-for="movie in movies" :key="movie.id">
          <p>{{ movie.title }}</p>
          <router-link :to="'/admin/edit/' + movie.id">Edit</router-link>
          <button @click="deleteMovie(movie.id)">Delete</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>You are not authorized to access this page.</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { db } from '@/firebase';
  import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const isAdmin = ref(false);
      const movies = ref([]);
  
      onMounted(async () => {
        if (authStore.user && authStore.user.email === 'admin12@gmail.com') {
          isAdmin.value = true;
          await fetchMovies();
        }
      });
  
      const fetchMovies = async () => {
        const querySnapshot = await getDocs(collection(db, 'movies'));
        movies.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      };
  
      const deleteMovie = async (id) => {
        await deleteDoc(doc(db, 'movies', id));
        await fetchMovies();
      };
  
      return {
        isAdmin,
        movies,
        deleteMovie
      };
    }
  };
  </script>
  
  <style scoped>
  .movie-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .movie {
    flex: 1 0 21%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .movie p {
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
  button.delete-button {
    background-color: #e50914;
  }
  button.delete-button:hover {
    background-color: #d40812;
  }
  </style>
  