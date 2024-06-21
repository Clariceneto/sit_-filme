<template>
  <div class="welcome">
    <h1>Welcome to HSFlix</h1>
    <p>Please log in or register to access our movie.</p>
    <div class="actions">
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </div>
    <div class="sample-movies">
      <h2>Featured Movies</h2>
      <div class="movie-list">
        <div class="movie" v-for="movie in sampleMovies" :key="movie.id">
          <img :src="getImageUrl(movie.poster_path)" alt="Movie Poster" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const sampleMovies = ref([]);

    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/movie/popular',
          {
            params: {
              api_key: '7cd02b2e82b90ba6c02522dd8a96457b',
              language: 'en-US',
              page: 1
            }
          }
        );
        sampleMovies.value = response.data.results;
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    const getImageUrl = (path) => {
      return `https://image.tmdb.org/t/p/w500${path}`;
    };

    onMounted(() => {
      fetchMovies();
    });

    return {
      sampleMovies,
      getImageUrl
    };
  }
};
</script>

<style scoped>
.welcome {
  text-align: center;
  padding: 2rem;
}
.actions {
  margin: 2rem 0;
}
.actions a {
  margin: 0 1rem;
  padding: 1rem 2rem;
  background-color: #e50914;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}
.actions a:hover {
  background-color: #d40812;
}
.sample-movies {
  margin-top: 2rem;
}
.movie-list {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.movie {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
}
.movie img {
  width: 150px;
  border-radius: 10px;
}
.movie p {
  margin-top: 0.5rem;
  color: white;
}
</style>
