<template lang="pug">
	.windows
		create-account
		create-folder
		create-todo
</template>

<script>
	import createAccount from "./windows/create_account.vue";
	import createFolder from "./windows/create_folder.vue";
	import createTodo from "./windows/create_todo.vue";

	export default {
		components: {
			createAccount,
			createFolder,
			createTodo
		}
	}
</script>

<style lang="scss">

</style>