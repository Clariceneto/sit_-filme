<template>
    <div class="error">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <router-link to="/">Go back to Home HsFlix</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ErrorView'
  };
  </script>
  
  <style scoped>
  .error {
    text-align: center;
    padding: 2rem;
  }
  .error h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .error p {
    margin-bottom: 1rem;
  }
  .error a {
    color: #e50914;
    text-decoration: none;
    font-weight: bold;
  }
  </style>
  