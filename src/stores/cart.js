import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  actions: {
    addItem(movie) {
      const existingItem = this.items.find(item => item.id === movie.id);
      if (!existingItem) {
        this.items.push(movie);
      }
    },
    removeItem(movie) {
      this.items = this.items.filter(item => item.id !== movie.id);
    },
    clearCart() {
      this.items = [];
    }
  },
  getters: {
    totalPrice(state) {
      return state.items.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
    }
  }
});
