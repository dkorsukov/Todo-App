export default {
	state: {
		creatingAccount: false,
		resetPassword: false,
		creatingFolder: false,
		creatingTodo: false,
		appSettings: false,
		todoImage: false,
		todoImageURL: ""
	},

	mutations: {
		setCreatingAccountPopup(state, value) {
			state.creatingAccount = value;
		},

		setResetPasswordPopup(state, value) {
			state.resetPassword = value;
		},

		setCreatingFolderPopup(state, value) {
			state.creatingFolder = value;
		},

		setCreatingTodoPopup(state, value) {
			state.creatingTodo = value;
		},

		setAppSettingsPopup(state, value) {
			state.appSettings = value;
		},

		setTodoImagePopup(state, value) {
			state.todoImage = value;
		},

		setTodoImageURL(state, value) {
			state.todoImageURL = value;
		}
	}
};