import Vue from "vue";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

import store from "./store/index.js";
import router from "./router/index.js";
import App from "./App.vue";

new Vue({
	render: (h) => <App />,
	store,
	router
}).$mount("#app");