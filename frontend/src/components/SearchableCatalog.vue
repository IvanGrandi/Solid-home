<template>
    <div class="Searchable_Catalog">
      <Search_bar
        @search="filterProducts"
        @reset_list="resetProductList"
      />
      <Catalog_product :products="filteredProducts" />
    </div>
  </template>
  
  <script>
  import Catalog_product from "../components/Catalog_product.vue";
  import Search_bar from "../components/Search_bar.vue";
  import { store } from "../store";

  export default {
    name: "SearchableCatalog",
    components: {
      Catalog_product,
      Search_bar,
    },
    props: {
      Page_category: String,
    },
    data() {
      return {
        text_to_search: "",
      };
    },
    computed: {
      // Computed rather than copied into data(), so it updates when the products finish loading
      filteredProducts() {
        return store.products.filter(item => {
          return (
            item.category === this.Page_category &&
            (!this.text_to_search ||
              item.product_name.toLowerCase().includes(this.text_to_search) ||
              (item.description || "").toLowerCase().includes(this.text_to_search))
          );
        });
      },
    },
    methods: {
      filterProducts(searchText) {
        this.text_to_search = searchText.trim().toLowerCase();
      },
      resetProductList() {
        this.text_to_search = "";
      },
    },
  };
  </script>
  