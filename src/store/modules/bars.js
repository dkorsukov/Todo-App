export default {
	state: {
		userSection: true,
		foldersListSection: false
	},

	mutations: {
		setUserSectionProgressBar(state, value) {
			state.userSection = value;
		},
		
		setFoldersListSectionProgressBar(state, value) {
			state.foldersListSection = value;
		}
	}
};