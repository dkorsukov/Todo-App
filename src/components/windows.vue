<template lang="pug">
	.windows
		create-account
		reset-password
		create-folder
		create-todo
		todo-image
		app-settings
</template>

<script>
	import createAccount from "./windows/create_account.vue";
	import resetPassword from "./windows/reset_password.vue";
	import createFolder from "./windows/create_folder.vue";
	import createTodo from "./windows/create_todo.vue";
	import todoImage from "./windows/todo_image.vue";
	import appSettings from "./windows/app_settings.vue";

	export default {
		components: {
			createAccount,
			resetPassword,
			createFolder,
			createTodo,
			todoImage,
			appSettings
		}
	}
</script>

<style lang="scss">

</style>