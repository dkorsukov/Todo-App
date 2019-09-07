export default {
	state: {
		userSection: true,
		foldersListSection: false,
		mainSection: false
	},

	mutations: {
		setUserSectionProgressBar(state, value) {
			state.userSection = value;
		},
		
		setFoldersListSectionProgressBar(state, value) {
			state.foldersListSection = value;
		},

		setMainSectionProgressBar(state, value) {
			state.mainSection = value;
		}
	}
};