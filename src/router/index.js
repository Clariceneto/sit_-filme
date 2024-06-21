import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import CartView from '../views/CartView.vue';
import SearchView from '../views/SearchView.vue';
import MovieView from '../views/MovieView.vue';
import CommentsView from '../views/CommentsView.vue';
import AdminView from '../views/AdminView.vue';
import EditMovieView from '../views/EditMovieView.vue';
import WelcomeView from '../views/WelcomeView.vue';
import ErrorView from '../views/ErrorView.vue';
import SeriesView from '../views/SeriesView.vue';
import TVView from '../views/TVView.vue';
import AnimeView from '../views/AnimeView.vue';
import { useAuthStore } from '@/stores/auth';

const routes = [
  { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/cart', name: 'Cart', component: CartView, meta: { requiresAuth: true } },
  { path: '/search', name: 'Search', component: SearchView, meta: { requiresAuth: true } },
  { path: '/movie/:id', name: 'Movie', component: MovieView, meta: { requiresAuth: true } },
  { path: '/comments', name: 'Comments', component: CommentsView, meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: AdminView, meta: { requiresAuth: true } },
  { path: '/admin/edit/:id?', name: 'EditMovie', component: EditMovieView, meta: { requiresAuth: true } },
  { path: '/welcome', name: 'Welcome', component: WelcomeView },
  { path: '/movies', name: 'Movies', component: MovieView, meta: { requiresAuth: true } },
  { path: '/series', name: 'Series', component: SeriesView, meta: { requiresAuth: true } },
  { path: '/tv', name: 'TV', component: TVView, meta: { requiresAuth: true } },
  { path: '/anime', name: 'Anime', component: AnimeView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'Error', component: ErrorView } // Rota para capturar todas as rotas inválidas
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.user) {
    next({ name: 'Welcome' });
  } else {
    next();
  }
});

export default router;
