<template>
  <div class="cart_container">
    <h2>{{ !productsLoaded ? 'Loading your cart...' : items.length === 0 ? 'Your cart is empty' : 'This is your cart' }}</h2>
    <ul>
      <li class="car_product_container" v-for="item in items" :key="item.product.id">
        <Cart_product
          :product="item.product"
          :quantity="item.quantity"
          @update-cart="addToCart(item.product)"
          @reduce_cart="removeOneFromCart(item.product.id)"
          @remove-product="removeFromCart(item.product.id)"
          @product-clicked="viewProduct"
        />
      </li>
    </ul>
    <div class="total" v-if="items.length !== 0">
      <p>Total to pay : {{ total }}$ ({{ count }} products)</p>
    </div>
  </div>
</template>

<script>
import Cart_product from '../components/Cart_product.vue';
import { store, cartItems, cartCount, cartTotal, addToCart, removeOneFromCart, removeFromCart } from '../store';
import { formatPrice } from '../utils';

export default {
  components: {
    Cart_product
  },
  computed: {
    productsLoaded() {
      return store.productsLoaded;
    },
    items() {
      return cartItems.value;
    },
    count() {
      return cartCount.value;
    },
    total() {
      return formatPrice(cartTotal.value);
    },
  },
  methods: {
    addToCart,
    removeOneFromCart,
    removeFromCart,
    viewProduct(id) {
      this.$router.push(`/product/${id}`);
    },
  },
};
</script>


<style scoped>
  .cart_container{
    width: 100%;
    min-height: 300px;
    height: auto;
    background-color: #EAEDED;
    padding-bottom: 20px;
  }
  .cart_container h2{
    text-align: center;
    padding: 20px;
  }

  .cart_container ul{
    width: calc(100% - 32px);
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    margin: 0 auto;
    border-radius: 20px 20px 0 0 ;
  }

  .total{
    width: calc(100% - 32px);
    max-width: 1000px;
    min-height: 100px;
    padding: 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    margin: 0 auto;
    border-radius: 0 0 20px 20px  ;
    font-size: larger;
  }

  .car_product_container{
    width: 100%;
    background-color: rgba(0, 128, 0, 0);
    height: auto;
  }  
</style>