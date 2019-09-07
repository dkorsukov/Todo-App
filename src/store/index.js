import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import mutations from "./mutations.js";
import actions from "./actions.js";
import user from "./modules/user.js";
import folders from "./modules/folders.js";
import bars from "./modules/bars.js";
import windows from "./modules/windows.js";

export default new Vuex.Store({
	state: {
		navigationVisibility: false,
		mobileBreakPoint: 1040
	},

	mutations, actions,

	modules: {
		user, folders, bars, windows
	}
});