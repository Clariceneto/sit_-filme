<template>
    <div class="search">
      <h1>Search Movies</h1>
      <input v-model="query" @keyup.enter="searchMovies" placeholder="Search for movies..."/>
      <div class="movie-list" v-if="movies.length">
        <div class="movie" v-for="movie in movies" :key="movie.id">
          <router-link :to="'/movie/' + movie.id">
            <img :src="getImageUrl(movie.poster_path)" alt="Movie Poster" />
            <p>{{ movie.title }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import tmdb from '@/tmdb';
  
  export default {
    data() {
      return {
        query: '',
        movies: []
      };
    },
    methods: {
      async searchMovies() {
        const response = await tmdb.get('/search/movie', {
          params: { query: this.query }
        });
        this.movies = response.data.results;
      },
      getImageUrl(path) {
        return `https://image.tmdb.org/t/p/w500${path}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .search {
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
  