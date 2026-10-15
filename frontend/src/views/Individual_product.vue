<template>
  <div class="product_details_page">
    <div v-if="!product">{{ productsLoaded ? "Product not found." : "Loading product details..." }}</div>
    <div v-else class="product_container">
      <img :src="product.img" alt="Product Image" />
      <div class="product_details">
        <h1>{{ product.product_name }}</h1>
        <hr />
        <p class="category">Category: {{ product.category }}</p>

        <div class="rating_section">
          <h3>Rating: {{ averageRating }} / 5</h3>
          <div v-if="ratings.length">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(averageRating) }">&#9733;</span>
          </div>
          <div v-else>No ratings yet.</div>
        </div>

        <h2>Price: {{ formatPrice(product.price) }} $</h2>
        <p class="description">Description:</p>
        <p>{{ product.description }}</p>

        <div v-if="isLoggedIn" class="add_rating">
          <label for="rating">Rate this product:</label>
          <select v-model="userRating" id="rating">
            <option value="" disabled>Select rating</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
          <button @click="submitRating" :disabled="submitting">Submit</button>
        </div>

        <button @click="addProductToCart">Add to Cart</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import ProductService from "../services/ProductService";
import { store, findProduct, addToCart } from "../store";
import { auth } from "../services/session";
import { formatPrice } from "../utils";

export default {
  name: "IndividualProduct",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      userRating: "", // To store the user's selected rating
      submitting: false,
    };
  },
  computed: {
    productsLoaded() {
      return store.productsLoaded;
    },
    product() {
      return findProduct(this.id) || null;
    },
    ratings() {
      return (this.product && this.product.ratings) || [];
    },
    isLoggedIn() {
      return Boolean(auth.session);
    },
    averageRating() {
      if (!this.ratings.length) return 0;
      const total = this.ratings.reduce((sum, rating) => sum + rating, 0);
      return Number((total / this.ratings.length).toFixed(1));
    },
  },
  methods: {
    formatPrice,
    addProductToCart() {
      if (!auth.session) {
        this.$router.push("/login");
        return;
      }
      addToCart(this.product);
    },
    async submitRating() {
      if (!this.userRating) {
        alert("Please select a rating before submitting.");
        return;
      }
      this.submitting = true;
      try {
        const updated = await ProductService.addRating(this.product.id, Number(this.userRating));
        this.product.ratings = updated.ratings; // Use the saved ratings from the server
        this.userRating = ""; // Reset user rating after submission
      } catch (error) {
        alert(error.response?.data?.message || "Could not submit your rating.");
      } finally {
        this.submitting = false;
      }
    },
  },
};

</script>

  

<style scoped>
.product_details_page{
    width: 100%;
    background-color: #EAEDED;
    padding-top: 30px;
    padding-bottom: 30px;
}

.product_container{
    margin: 0 auto;
    background: white;
    display: flex;
    width: 70%;
    padding: 20px;
    border-radius: 20px;
    gap:20px;
}

.product_container img{
    max-width: 400px;
    height: 100%;
    border: 1px solid gray;
}


.product_details {
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex-grow: 1; 
}

.product_details button {
    background-color: #243E36;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 20px;
    height: 40px;
    cursor: pointer;
}
.category{
    color: grey;
    font-weight: bold;
}

.description{
    text-decoration: underline;
}

.product_details h1, .product_details h2{
    color: #243E36;
}

hr{
    width: 100%;
}

.star {
  font-size: 24px;
  color: #ccc;
}
.star.filled {
  color: gold;
}
.rating_section {
  margin: 10px 0;
}
.add_rating {
  margin-top: 10px;
  display: flex;
  justify-content: center; /* Center the button */
  align-items: center;
  gap: 10px;
  height: 70px;
}

.add_rating button {
  padding: 5px 10px; /* Adjust padding to make the button smaller */
  height: 40px; /* Adjust the height if needed */
  background-color: #243E36;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}


@media (max-width: 800px){
  .product_container{
    flex-direction: column;
    align-items: center;
  }
  .product_container img{
    max-width: 250px;
    
}

}
</style>