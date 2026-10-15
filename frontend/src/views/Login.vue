<template>
  <div class="auth-container">
    <h1>Login</h1>
    <form class="auth-form" @submit.prevent="loginUser">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        autocomplete="email"
        class="auth-input"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="auth-input"
        required
      />
      <button type="submit" class="auth-button">Login</button>
    </form>
  </div>
</template>

<script>
import apiClient from "../services/apiService";
import { saveSession } from "../services/session";
import { toast } from "../services/toast";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await apiClient.post("/auth/login", {
          email: this.email,
          password: this.password,
        });

        // Blocked accounts are rejected by the server with a 403 and end up in the catch below
        const { accessToken, username } = response.data;
        saveSession(accessToken, username); // The menu updates reactively, no page reload needed
        toast.success(`Welcome back, ${username}!`);
        this.$router.push("/"); // Redirect to home page
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed!");
      }
    },
  },
};
</script>
  
  <style scoped>
  .auth-container {
    width: 100%;
    max-width: 500px;
    margin: 50px auto;
    padding: 0 16px;
    text-align: center;
    font-family: "Montserrat", sans-serif;
  }
  
  .auth-container h1 {
    font-size: 2rem;
    color: #243e36;
    margin-bottom: 20px;
  }
  
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .auth-input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
  }
  
  .auth-button {
    background-color: #243e36;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }
  
  .auth-button:hover {
    background-color: white;
    color: #243e36;
    border: 1px solid #243e36;
  }
  </style>
  
  