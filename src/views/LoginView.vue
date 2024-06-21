<template>
    <div class="login">
      <h1>Login</h1>
      <input v-model="email" placeholder="Email"/>
      <input v-model="password" type="password" placeholder="Password"/>
      <button @click="login">Login</button>
    </div>
  </template>
  
  <script>
  import { auth } from '@/firebase';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async login() {
        try {
          await signInWithEmailAndPassword(auth, this.email, this.password);
          this.$router.push('/');
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }
  .login input {
    margin: 0.5rem;
    padding: 0.5rem;
    width: 200px;
  }
  .login button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #e50914;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  