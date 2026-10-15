import { reactive, computed, watch } from "vue";
import ProductService from "./services/ProductService";

const CART_KEY = "cart";

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Shared state for the whole app (replaces passing props down from App.vue and $root access)
export const store = reactive({
  products: [],
  productsLoaded: false,
  cart: loadCart(), // [{ id, quantity }] - persisted so a page refresh keeps the cart
});

watch(
  () => store.cart,
  (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart)),
  { deep: true }
);

export async function fetchProducts() {
  try {
    store.products = await ProductService.getAllProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    store.productsLoaded = true;
  }
}

export function findProduct(id) {
  return store.products.find((product) => product.id === Number(id));
}

// Cart entries joined with their product; entries for products that no longer exist are skipped
export const cartItems = computed(() =>
  store.cart
    .map((entry) => ({ product: findProduct(entry.id), quantity: entry.quantity }))
    .filter((item) => item.product)
);

export const cartCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
);

// Summed in cents to avoid floating point drift (0.1 + 0.2 !== 0.3)
export const cartTotal = computed(
  () =>
    cartItems.value.reduce(
      (sum, item) => sum + Math.round(item.product.price * 100) * item.quantity,
      0
    ) / 100
);

export function addToCart(product) {
  const entry = store.cart.find((item) => item.id === product.id);
  const inCart = entry ? entry.quantity : 0;

  if (inCart >= product.quantity_available) {
    alert("There are no more products of this kind available");
    return;
  }

  if (entry) {
    entry.quantity++;
  } else {
    store.cart.push({ id: product.id, quantity: 1 });
  }
}

export function removeOneFromCart(productId) {
  const index = store.cart.findIndex((item) => item.id === productId);
  if (index === -1) return;

  if (store.cart[index].quantity > 1) {
    store.cart[index].quantity--;
  } else {
    store.cart.splice(index, 1);
  }
}

export function removeFromCart(productId) {
  const index = store.cart.findIndex((item) => item.id === productId);
  if (index !== -1) store.cart.splice(index, 1);
}

export function clearCart() {
  store.cart = [];
}
