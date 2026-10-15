<template>
    <User_menu />
    <router-view />
    <Footer_User />
  </template>
  
  <script>
  import User_menu from "./components/User_menu.vue";
  import Footer_User from "./components/Footer_User.vue";
  import { fetchProducts } from "./store";

  // Products and the cart live in ./store.js, so views read them directly instead of through props
  export default {
    name: "App",
    components: {
      User_menu,
      Footer_User,
    },
    mounted() {
      fetchProducts(); // Load products when the app loads
    },
  }
  </script>
  

<style>
*{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Montserrat";
    list-style: none;
}

html{
    width: 100%;
}

body{
    width: 100%;
}
</style>
