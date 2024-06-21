<template>
  <div class="movies">
    <h1>Movies</h1>
    <div class="movie-list" v-if="movies.length">
      <div class="movie" v-for="movie in movies" :key="movie.id">
        <img :src="getImageUrl(movie.poster_path)" alt="Movie Poster" />
        <p>{{ movie.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import tmdb from '@/tmdb';

export default {
  setup() {
    const movies = ref([]);

    const fetchMovies = async () => {
      try {
        const response = await tmdb.get('/movie/popular');
        movies.value = response.data.results;
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
      movies,
      getImageUrl
    };
  }
};
</script>

<style scoped>
.movies {
  padding: 2rem;
}
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
.movie img {
  width: 100%;
  border-radius: 10px;
}
.movie p {
  margin-top: 0.5rem;
  color: white;
}
</style>
