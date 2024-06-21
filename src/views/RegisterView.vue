<template>
  <div class="register">
    <h1>Register</h1>
    <input v-model="firstName" placeholder="First Name" />
    <input v-model="lastName" placeholder="Last Name" />
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="register">Register</button>
    <p>Already have an account? <router-link to="/login">Login here</router-link></p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async register() {
      try {
        // Registrar o usuário no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Adicionar informações adicionais do usuário ao Firestore
        await setDoc(doc(db, 'users', user.uid), {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email
        });

        // Redirecionar para a página de login após o registro
        this.$router.push('/login');
      } catch (error) {
        console.error("Error during registration:", error);
        this.error = error.message;
      }
    }
  }
};
</script>

<style scoped>
.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}
.register input {
  margin: 0.5rem;
  padding: 0.5rem;
  width: 200px;
}
.register button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e50914;
  color: white;
  border: none;
  cursor: pointer;
}
.register button:hover {
  background-color: #d40812;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
