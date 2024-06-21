<template>
  <div v-if="isAdmin">
    <h1>{{ isEditing ? 'Edit Movie' : 'Add Movie' }}</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="title" placeholder="Title" required />
      <input v-model="posterPath" placeholder="Poster Path" required />
      <textarea v-model="overview" placeholder="Overview" required></textarea>
      <input v-model="releaseDate" placeholder="Release Date" required />
      <input v-model="price" placeholder="Price" required type="number" />
      <button type="submit">{{ isEditing ? 'Update' : 'Add' }} Movie</button>
      <button v-if="isEditing" type="button" @click="deleteMovie">Delete Movie</button>
    </form>
  </div>
  <div v-else>
    <p>You are not authorized to access this page.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { db } from '@/firebase';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const isAdmin = ref(false);
    const isEditing = ref(false);
    const movieId = ref(null);
    const title = ref('');
    const posterPath = ref('');
    const overview = ref('');
    const releaseDate = ref('');
    const price = ref('');

    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
      if (authStore.user && authStore.user.email === 'admin12@gmail.com') {
        isAdmin.value = true;
        if (route.params.id) {
          isEditing.value = true;
          movieId.value = route.params.id;
          await loadMovie(movieId.value);
        }
      }
    });

    const loadMovie = async (id) => {
      const movieDoc = await getDoc(doc(db, 'movies', id));
      if (movieDoc.exists()) {
        const movieData = movieDoc.data();
        title.value = movieData.title;
        posterPath.value = movieData.posterPath;
        overview.value = movieData.overview;
        releaseDate.value = movieData.releaseDate;
        price.value = movieData.price;
      } else {
        console.error("No such document!");
      }
    };

    const handleSubmit = async () => {
      const movieData = {
        title: title.value,
        posterPath: posterPath.value,
        overview: overview.value,
        releaseDate: releaseDate.value,
        price: price.value
      };

      try {
        if (isEditing.value) {
          const movieDocRef = doc(db, 'movies', movieId.value);
          const movieDoc = await getDoc(movieDocRef);
          if (movieDoc.exists()) {
            await updateDoc(movieDocRef, movieData);
          } else {
            console.error("No document to update");
          }
        } else {
          await addDoc(collection(db, 'movies'), movieData);
        }
        router.push('/admin');
      } catch (error) {
        console.error("Error updating/adding movie:", error);
      }
    };

    const deleteMovie = async () => {
      try {
        const movieDocRef = doc(db, 'movies', movieId.value);
        const movieDoc = await getDoc(movieDocRef);
        if (movieDoc.exists()) {
          await deleteDoc(movieDocRef);
          router.push('/admin');
        } else {
          console.error("No document to delete");
        }
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    };

    return {
      isAdmin,
      isEditing,
      title,
      posterPath,
      overview,
      releaseDate,
      price,
      handleSubmit,
      deleteMovie
    };
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
input, textarea {
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  border: none;
  color: white;
}
button:hover {
  transform: scale(1.05);
}
button[type="submit"] {
  background-color: #4caf50;
}
button[type="submit"]:hover {
  background-color: #388e3c;
}
button[type="button"] {
  background-color: #e50914;
}
button[type="button"]:hover {
  background-color: #d40812;
}
</style>
