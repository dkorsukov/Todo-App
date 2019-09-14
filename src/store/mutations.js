export default {
	setNavigationVisibility(state, value) {
		state.navigationVisibility = value;
	},

	setDarkTheme(state, value) {
		state.darkTheme = value;

		localStorage.setItem("todo-app/user-data/dark-theme", value);
	}
};