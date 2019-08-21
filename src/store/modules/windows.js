export default {
	state: {
		creatingAccount: false
	},

	mutations: {
		openCreatingAccountPopup(state) {
			state.creatingAccount = true;
		},
	
		closeCreatingAccountPopup(state) {
			state.creatingAccount = false;
		}			
	}
};