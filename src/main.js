import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import './assets/global.css';

const app = createApp(App);

app.use(router);
app.use(createPinia());

const authStore = useAuthStore();
authStore.init();

app.mount('#app');
