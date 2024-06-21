<template>
    <div class="comments">
      <h1>Comments</h1>
      <input v-model="newComment" placeholder="Add a comment"/>
      <button @click="addComment">Submit</button>
      <div class="comment-list" v-if="comments.length">
        <div class="comment" v-for="comment in comments" :key="comment.id">
          <p>{{ comment.text }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from '@/firebase';
  import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        newComment: '',
        comments: []
      };
    },
    async created() {
      this.fetchComments();
    },
    methods: {
      async addComment() {
        const comment = {
          text: this.newComment,
          movieId: this.$route.params.id
        };
        await addDoc(collection(db, 'comments'), comment);
        this.newComment = '';
        this.fetchComments();
      },
      async fetchComments() {
        const q = query(collection(db, 'comments'), where('movieId', '==', this.$route.params.id));
        const querySnapshot = await getDocs(q);
        this.comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    }
  };
  </script>
  
  <style scoped>
  .comments {
    padding: 2rem;
  }
  .comment-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .comment {
    padding: 1rem;
    background-color: #333;
    border-radius: 10px;
  }
  .comment p {
    color: white;
  }
  </style>
  