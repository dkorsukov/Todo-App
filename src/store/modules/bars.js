export default {
	state: {
		userSection: true,
		todosListSection: false
	},

	mutations: {
		setUserSectionProgressBar(state, value) {
			state.userSection = value;
		}	
	}
};