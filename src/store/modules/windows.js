export default {
	state: {
		creatingAccount: false,
		creatingFolder: false,
		creatingTodo: false
	},

	mutations: {
		setCreatingAccountPopup(state, value) {
			state.creatingAccount = value;
		},

		setCreatingFolderPopup(state, value) {
			state.creatingFolder = value;
		},

		setCreatingTodoPopup(state, value) {
			state.creatingTodo = value;
		}
	}
};