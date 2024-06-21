import axios from 'axios';

const API_KEY = '7cd02b2e82b90ba6c02522dd8a96457b';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY
  }
});

export default tmdb;
