<template>
  <div class="cart">
    <h1>Cart</h1>
    <div v-if="cartItems.length">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <p>{{ item.title }} - {{ formatPrice(item.price) }}</p>
        <button @click="removeFromCart(item)">Remove</button>
      </div>
      <button class="checkout-button" @click="checkout">Compra</button>
      <p>Total: {{ formatPrice(totalPrice) }}</p>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default {
  setup() {
    const cartStore = useCartStore();
    const authStore = useAuthStore();

    const removeFromCart = (item) => {
      cartStore.removeItem(item);
    };

    const checkout = async () => {
      if (!authStore.user) {
        alert('Please log in to complete the purchase.');
        return;
      }

      try {
        const purchaseData = {
          userId: authStore.user.uid,
          items: cartStore.items,
          total: cartStore.totalPrice,
          timestamp: new Date()
        };
        await addDoc(collection(db, 'purchases'), purchaseData);
        alert(`Compra finalizada com sucesso! Total: $${cartStore.totalPrice}`);
        cartStore.clearCart();
      } catch (error) {
        console.error('Error completing purchase:', error);
        alert('Houve um erro ao finalizar sua compra. Por favor, tente novamente.');
      }
    };

    return {
      cartItems: cartStore.items,
      totalPrice: cartStore.totalPrice,
      removeFromCart,
      checkout
    };
  },
  methods: {
    formatPrice(price) {
      return `$${price}`;
    }
  }
};
</script>

<style scoped>
.cart {
  padding: 2rem;
}
.cart-item {
  padding: 1rem;
  background-color: #333;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.cart-item p {
  color: white;
}
button {
  margin-top: 0.5rem;
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
button.remove-button {
  background-color: #e50914;
}
button.remove-button:hover {
  background-color: #d40812;
}
button.checkout-button {
  background-color: #4caf50;
}
button.checkout-button:hover {
  background-color: #388e3c;
}
</style>
