import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faBars, faCartShopping, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

// Register only the icons we use; adding the whole `fab`/`fas` sets bundles thousands of icons
library.add(faFacebook, faInstagram, faYoutube, faBars, faCartShopping, faMagnifyingGlass, faXmark);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router).mount('#app');
