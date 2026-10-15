<template>
    <User_menu />
    <main class="page_content">
      <router-view />
    </main>
    <Footer_User />
    <Toast_container />
  </template>
  
  <script>
  import User_menu from "./components/User_menu.vue";
  import Footer_User from "./components/Footer_User.vue";
  import Toast_container from "./components/Toast_container.vue";
  import { fetchProducts } from "./store";

  // Products and the cart live in ./store.js, so views read them directly instead of through props
  export default {
    name: "App",
    components: {
      User_menu,
      Footer_User,
      Toast_container,
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

img{
    max-width: 100%;
}

/* Keep the footer at the bottom of the screen on short pages */
#app{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.page_content{
    flex: 1 0 auto;
}
</style>
