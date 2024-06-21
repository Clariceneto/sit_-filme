<template>
  <div id="app">
    <Header />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
};
</script>

<style>
body {
  background-color: #141414;
  color: white;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
