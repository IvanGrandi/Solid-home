<template>
  <div class="product-management">
    <h1>Product Management</h1>
    <div class="Form_div">
      <form @submit.prevent="createProduct">
        <label for="product_name">Product Name</label>
        <input
          type="text"
          id="product_name"
          v-model="newProduct.product_name"
          placeholder="Product Name"
          required
        />

        <label for="description">Product Description</label>
        <textarea
          id="description"
          v-model="newProduct.description"
          placeholder="Product Description"
          required
        ></textarea>

        <label for="img">Product Image URL</label>
        <input
          type="text"
          id="img"
          v-model="newProduct.img"
          placeholder="Product Image URL"
        />

        <label for="quantity_available">Quantity Available</label>
        <input
          type="number"
          id="quantity_available"
          v-model.number="newProduct.quantity_available"
          placeholder="Quantity Available"
          min="0"
          step="1"
          required
        />

        <label for="price">Price</label>
        <input
          type="number"
          id="price"
          v-model.number="newProduct.price"
          placeholder="Price"
          step="0.01"
          min="0"
          required
        />

        <label for="category">Category</label>
        <select v-model="newProduct.category" id="category" required>
          <option value="" disabled>Select Category</option>
          <option v-for="category in categories" :key="category" :value="category">{{ categoryLabel(category) }}</option>
        </select>

        <div class="button_box">
          <button type="submit">Add Product</button>
          <button
            type="button"
            @click="deleteAllProducts"
            class="delete-all-button"
          >
            Delete All Products
          </button>
        </div>
      </form>
    </div>

    <div class="list_of_products">
      <h2>Existing Products</h2>
      <hr />
      <ul class="product_container">
        <li
          v-for="product in products"
          :key="product.id"
          class="single_product"
        >
          <img :src="product.img" alt="Product Image" /> <br />
          <div class="single_product_details">
            <p><strong>ID:</strong> {{ product.id }}</p>
            <p><strong>Product Name:</strong> {{ product.product_name }}</p>
            <p><strong>Description:</strong> {{ product.description }}</p>
            <p><strong>Price:</strong> ${{ formatPrice(product.price) }}</p>
            <p><strong>Category:</strong> {{ product.category }}</p>
            <p><strong>Quantity Available:</strong> {{ product.quantity_available }}</p>
          </div>

          <div class="single_product_buttons_box" >
            <button type="button" @click="deleteProduct(product.id)">Delete</button>
            <button @click="editProduct(product)">Edit</button>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="editingProduct" class="edit_product">
      <h3>Edit Product</h3>
      <hr />
      <form @submit.prevent="updateProduct">
        <label for="edit_product_name">Product Name</label>
        <input
          type="text"
          id="edit_product_name"
          v-model="editingProduct.product_name"
          placeholder="Product Name"
          required
        />

        <label for="edit_description">Product Description</label>
        <textarea
          id="edit_description"
          v-model="editingProduct.description"
          placeholder="Product Description"
          required
        ></textarea>

        <label for="edit_img">Product Image URL</label>
        <input
          type="text"
          id="edit_img"
          v-model="editingProduct.img"
          placeholder="Product Image URL"
        />

        <label for="edit_quantity_available">Quantity Available</label>
        <input
          type="number"
          id="edit_quantity_available"
          v-model.number="editingProduct.quantity_available"
          placeholder="Quantity Available"
          min="0"
          step="1"
          required
        />

        <label for="edit_price">Price</label>
        <input
          type="number"
          id="edit_price"
          v-model.number="editingProduct.price"
          placeholder="Price"
          step="0.01"
          min="0"
          required
        />

        <label for="edit_category">Category</label>
        <select v-model="editingProduct.category" id="edit_category" required>
          <option value="" disabled>Select Category</option>
          <option v-for="category in categories" :key="category" :value="category">{{ categoryLabel(category) }}</option>
        </select>

        <button type="submit">Update Product</button>
      </form>
    </div>
  </div>
</template>

<script>
import ProductService from "../services/ProductService";
import { store, fetchProducts } from "../store";
import { CATEGORIES, formatPrice } from "../utils";
import { toast } from "../services/toast";

const emptyProduct = () => ({
  product_name: "",
  description: "",
  img: "",
  quantity_available: null,
  price: null,
  category: "",
});

export default {
  name: "ProductManagement",
  data() {
    return {
      categories: CATEGORIES,
      newProduct: emptyProduct(),
      editingProduct: null,
    };
  },
  computed: {
    // Shared with the shop pages, so changes show up there without a reload
    products() {
      return store.products;
    },
  },
  methods: {
    formatPrice,
    categoryLabel(category) {
      return category === "Home" ? "Home (featured on home page)" : category;
    },
    async createProduct() {
      try {
        await ProductService.createProduct(this.newProduct);
        toast.success(`"${this.newProduct.product_name}" was added.`);
        this.resetForm();
        await fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not create the product.");
      }
    },
    async deleteProduct(id) {
      if (!confirm("Delete this product?")) return;
      try {
        await ProductService.deleteProduct(id);
        toast.success("Product deleted.");
        await fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not delete the product.");
      }
    },
    async deleteAllProducts() {
      if (!confirm("Delete ALL products? This cannot be undone.")) return;
      try {
        await ProductService.deleteAllProducts();
        toast.success("All products deleted.");
        await fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not delete the products.");
      }
    },
    editProduct(product) {
      this.editingProduct = { ...product };
    },
    async updateProduct() {
      try {
        await ProductService.updateProduct(this.editingProduct.id, this.editingProduct);
        toast.success("Product updated.");
        this.editingProduct = null;
        await fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not update the product.");
      }
    },
    resetForm() {
      this.newProduct = emptyProduct();
    },
  },
  mounted() {
    fetchProducts();
  },
};
</script>



<style scoped>
  .product-management{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .product-management h1{
    margin: 20px;
  }
  .Form_div{
    padding: 30px;
    background-color: #243E36;
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 30px;
  }
  form{
    display: flex;
    flex-direction: column;
    gap:10px;
    width: 100%;
  }

  form label{
    color: white;
    font-weight: bold;
    font-size: large;
  }
  form input,form textarea{
    height: 30px;
    padding-left: 8px;
    border-radius: 5px;
    border: none;
    outline: none; 
  }

  form textarea{
    padding-top: 6px;
    height: 60px;
  }
  .button_box{
    display: flex;
    justify-content: center;
    gap:20px;
  }

  .button_box button{
    margin-top: 10px;
    background-color: white;
    border: none;
    padding: 6px;
    border-radius: 10px;
    color: black;
    transition: background-color 0.3s ease-in-out;
  }

  .button_box button:hover{
    cursor: pointer;
    background-color: black;
    color: white;
  }

  .list_of_products{
    margin-top: 30px;
    margin-bottom: 30px;
    width: 80%;

  }
  .product_container{
    width: 100%;
  }
  
  
  .single_product{
    background-color: rgb(173, 173, 173);
    margin-top: 15px;
    padding: 15px;
    display: flex;
    border-radius: 10px;
    gap: 8px;
  }

  .single_product_details{
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 50%;
  }
  .single_product img{
    width: 200px;
    height: auto;
  }
  
  .single_product_buttons_box{
    width: 25%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    background-color: #243E36;
    justify-content: center;
    gap: 20px;
    padding: 20px;
  }
  .single_product_buttons_box button{
    height: 40px;
    border: none;
    border-radius: 10px;
    padding: 5px;
    transition: background-color 0.3s ease-in-out;
  }

  .single_product_buttons_box button:hover{
    cursor: pointer;
    background-color: black;
    color: white;
  }

  .edit_product {
  padding: 30px;
  background-color: grey;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 30px;
  margin-top: 30px;
  color: white;
  margin-bottom: 30px;
}

.edit_product form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.edit_product label {
  color: white;
  font-weight: bold;
  font-size: large;
}

.edit_product input,
.edit_product textarea {
  height: 30px;
  padding-left: 8px;
  border-radius: 5px;
  border: none;
  outline: none;
}

.edit_product textarea {
  padding-top: 6px;
  height: 60px;
}

.edit_product button {
  margin-top: 10px;
  background-color: white;
  border: none;
  padding: 8px;
  border-radius: 10px;
  color: black;
  transition: background-color 0.3s ease-in-out;
}

.edit_product button:hover {
  cursor: pointer;
  background-color: black;
  color: white;
}





  @media (max-width: 800px){
    .single_product{
      flex-direction: column;
    }
    .single_product_buttons_box{
      margin-top: 10px;
      width: 100%;
    }
    .single_product img{
      
      margin: 0 auto;
      text-align: center;
    }

  }
</style>