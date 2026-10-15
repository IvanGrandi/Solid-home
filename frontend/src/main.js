import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

// Register only the icons we use; adding the whole `fab`/`fas` sets bundles thousands of icons
library.add(faFacebook, faInstagram, faYoutube, faCartShopping, faMagnifyingGlass);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router).mount('#app');
