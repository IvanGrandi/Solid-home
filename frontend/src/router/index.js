import { createRouter, createWebHistory } from 'vue-router'
import Home from "../views/Home.vue";
import { refreshSession } from "../services/session";

// Every page except Home is loaded on demand, so the first visit downloads less JavaScript
const routes = [
    {
        path: "/",
        name : "Home",
        component: Home ,
    },
    {
        path: "/beds",
        name : "Beds",
        component: () => import('../views/Beds.vue'),
    },
    {
        path: "/decoration",
        name : "Decoration",
        component: () => import('../views/Decoration.vue'),
    },
    {
        path: "/furniture",
        name : "Furniture",
        component: () => import('../views/Furniture.vue'),
    },
    {
        path: "/storage",
        name : "Storage",
        component: () => import('../views/Storage.vue'),
    },
    {
        path: "/cart",
        name : "Cart",
        component: () => import('../views/Cart.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "/product/:id",
        name: "Individual_product",
        component: () => import('../views/Individual_product.vue'),
        props: true,
      },
      {
        path: "/register",
        name: "Register",
        component: () => import("../views/Registry.vue"),
        meta: { guest: true }, // Mark as accessible to guests only
      },
      {
        path: "/login",
        name: "Login",
        component: () => import("../views/Login.vue"),
        meta: { guest: true }, // Mark as accessible to guests only
      },
      {
        path: "/products",
        name: "ProductManagement",
        component: () => import("../views/ProductManagement.vue"),
        meta: { requiresAuth: true, role: "admin" }, // Restricted to admin
      },
      {
        path: "/users",
        name: "UserManagement",
        component: () => import("../views/UserManagement.vue"),
        meta: { requiresAuth: true, role: "admin" }, // Restricted to admin
      },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
});

// Route Guards (UX only - the API enforces the same rules on the server)
router.beforeEach((to) => {
  const session = refreshSession(); // Also drops an expired or malformed token

  // If route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!session) {
      return "/login"; // Redirect to login if not authenticated
    }
    if (to.meta.role && !session.roles.includes(to.meta.role)) {
      return "/"; // Redirect to home if the user lacks the required role
    }
    return true;
  }

  // If route is for guests only
  if (to.matched.some((record) => record.meta.guest) && session) {
    return "/"; // Redirect to home if already authenticated
  }

  return true; // Allow navigation if no guard is triggered
});

export default router;
