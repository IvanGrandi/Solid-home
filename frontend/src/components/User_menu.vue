<template>
  <nav class="menu" :class="{ open: menuOpen }">
    <!-- Compact bar, only visible on small screens -->
    <div class="menu_bar">
      <button
        type="button"
        class="menu_toggle"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        aria-controls="menu_content"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <font-awesome-icon :icon="['fas', menuOpen ? 'xmark' : 'bars']" />
      </button>
      <router-link v-if="role !== 'admin'" to="/cart" class="cart_compact" aria-label="Cart">
        <font-awesome-icon :icon="['fas', 'cart-shopping']" />
        <span class="cart_badge">{{ cartCount }}</span>
      </router-link>
    </div>

    <div id="menu_content" class="menu_content">
      <div class="menu_pages">
        <div class="menu_pages__links">
          <!-- Common Links for All Roles -->
          <router-link to="/" class="routers">Home</router-link>

          <!-- Admin-Specific Links -->
          <router-link v-if="role === 'admin'" to="/products" class="routers">Product Management</router-link>
          <router-link v-if="role === 'admin'" to="/users" class="routers">User Management</router-link>

          <!-- Shop Links (guests and users) -->
          <router-link v-if="role !== 'admin'" to="/storage" class="routers">Storage</router-link>
          <router-link v-if="role !== 'admin'" to="/furniture" class="routers">Furniture</router-link>
          <router-link v-if="role !== 'admin'" to="/beds" class="routers">Beds</router-link>
          <router-link v-if="role !== 'admin'" to="/decoration" class="routers">Decoration</router-link>
        </div>
      </div>

      <div class="menu_right_section">
        <!-- Cart Section (guests are sent to login when they open it) -->
        <div v-if="role !== 'admin'" class="cart_summary">
          <router-link to="/cart" class="cart">
            <div class="items_menu">
              <font-awesome-icon :icon="['fas', 'cart-shopping']" />
              <p>Cart</p>
            </div>
          </router-link>
          <div class="items_menu">
            {{ cartCount }} <p>Items</p>
          </div>
          <div class="items_menu">
            {{ cartTotal }}$ <p>Total Amount</p>
          </div>
        </div>

        <!-- Authentication Section -->
        <div class="right_section__buttons">
          <!-- Guest -->
          <div v-if="role === 'guest'" class="right_section__buttons_box">
            <button @click="goToLogin">Login</button>
            <button @click="goToRegister">Register</button>
          </div>
          <!-- User and Admin -->
          <div v-else class="user_logged_buttons">
            <span :title="userName">{{ userName }}</span>
            <button @click.prevent="logout">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <div class="space"></div>
</template>

<script>
import { auth, clearSession } from "../services/session";
import { cartCount, cartTotal, clearCart } from "../store";
import { formatPrice } from "../utils";

export default {
  name: "User_menu",
  data() {
    return {
      menuOpen: false, // Mobile menu
    };
  },
  computed: {
    role() {
      if (!auth.session) return "guest";
      return auth.session.roles.includes("admin") ? "admin" : "user";
    },
    userName() {
      return auth.session ? auth.session.username : "";
    },
    cartCount() {
      return cartCount.value;
    },
    cartTotal() {
      return formatPrice(cartTotal.value);
    },
  },
  watch: {
    // Close the mobile menu after navigating
    $route() {
      this.menuOpen = false;
    },
  },
  methods: {
    goToLogin() {
      this.$router.push("/login"); // Navigate to Login page
    },
    goToRegister() {
      this.$router.push("/register"); // Navigate to Register page
    },
    logout() {
      clearSession(); // The menu updates reactively, no page reload needed
      clearCart();
      this.menuOpen = false;
      this.$router.push("/"); // Redirect to Home
    },
  },
};
</script>



<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Montserrat";
  list-style: none;
}

.menu {
  width: 100%;
  position: fixed;
  top: 0;
  height: 60px;
  display: flex;
  background-color: #f0e9d7;
  font-size: large;
  z-index: 1000;
}

.space {
  height: 60px;
}

.menu_bar {
  display: none;
}

.menu_content {
  display: flex;
  width: 100%;
}

.menu_pages,
.menu_right_section {
  display: flex;
  align-items: center;
  gap: 5px;
}

.menu_pages {
  flex: 1;
  min-width: 0;
  justify-content: center;
  margin: 5px;
}

.menu_right_section {
  flex: 0 0 auto;
  justify-content: flex-end;
  gap: 10px;
  padding-right: 20px;
}

.menu_pages__links {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  list-style: none;
  gap: 5px;
}

.routers {
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 6px 12px;
  border-radius: 20px;
  color: black;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  text-decoration: none;
}

.routers:hover, .right_section__buttons>button:hover {
    color: #243E36;
    background-color: white;
    border-bottom: 1px solid #243E36;
    cursor: pointer;
}

.cart_summary {
  display: flex;
  align-items: center;
  gap: 5px;
}

.right_section__buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.right_section__buttons button {
  background-color: #243e36;
  border: 1px solid #243e36;
  color: white;
  border-radius: 20px;
  padding: 7px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.right_section__buttons button:hover {
  background-color: white;
  color: #243e36;
  border: 1px solid #243e36;
}

.right_section__buttons span {
  font-weight: bold;
  color: #243e36;
  /* Long usernames are shortened instead of pushing the Logout button off screen */
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.items_menu {
  text-align: center;
  padding: 8px;
  border-radius: 10px;
  white-space: nowrap;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.items_menu p {
  font-size: small;
}

.items_menu:hover {
  background: white;
}

.cart {
  border-radius: 10px;
  text-decoration: none;
  color: black;
}


.user_logged_buttons{
  display: flex;
  align-items: center;
  gap: 10px;
}

.right_section__buttons_box{
  display: flex;
  gap: 10px
}

/* Small screens: compact bar with a hamburger button that opens the full menu */
@media (max-width: 900px) {
  .menu {
    flex-direction: column;
    height: auto;
    max-height: 100vh;
    overflow-y: auto;
  }

  .menu.open {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  .menu_bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 16px;
    flex-shrink: 0;
  }

  .menu_toggle {
    background: none;
    border: none;
    font-size: 26px;
    width: 44px;
    height: 44px;
    color: #243e36;
    cursor: pointer;
  }

  .cart_compact {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    font-size: 22px;
    color: #243e36;
  }

  .cart_badge {
    position: absolute;
    top: 2px;
    right: 0;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 10px;
    background-color: #243e36;
    color: white;
    font-size: 12px;
    font-weight: bold;
    line-height: 20px;
    text-align: center;
  }

  .menu_content {
    display: none;
    flex-direction: column;
    padding: 0 16px 20px;
  }

  .menu.open .menu_content {
    display: flex;
  }

  .menu_pages {
    margin: 0;
  }

  .menu_pages__links {
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
  }

  .routers {
    justify-content: flex-start;
    padding: 12px;
    border-radius: 10px;
  }

  .menu_right_section {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 0 0;
    margin-top: 8px;
    border-top: 1px solid rgba(36, 62, 54, 0.2);
  }

  .cart_summary {
    justify-content: space-around;
  }

  .right_section__buttons,
  .right_section__buttons_box,
  .user_logged_buttons {
    justify-content: center;
  }

  .right_section__buttons button {
    padding: 10px 22px;
  }
}
</style>
