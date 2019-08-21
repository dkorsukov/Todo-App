import Vue from "vue";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify, {
	iconfont: "md"
});

import store from "./store/index.js";
import router from "./router/index.js";
import App from "./App.vue";

new Vue({
	render: (h) => <App />,
	store,
	router
}).$mount("#app");

if (module.hot) {
	module.hot.accept();
}