<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/series">Series</router-link></li>
        <li><router-link to="/tv">TV</router-link></li>
        <li><router-link to="/anime">Anime</router-link></li>
        <li><router-link to="/cart">Carinho</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
header {
  background-color: #333;
  color: white;
  padding: 1rem;
}
nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}
nav ul li {
  display: inline;
}
nav ul li a {
  color: white;
  text-decoration: none;
}
nav ul li a:hover {
  text-decoration: underline;
}
</style>
