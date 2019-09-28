<template lang="pug">
	v-layout.mt-2(row, wrap)
		todo-item(v-for="(todo, index) in todos",
							:key="index",
							:created="todo.created",
							:title="todo.title",
							:hasImage="todo.hasImage",
							:time="todo.time",
							:single="todo.single",							
							:interval="todo.interval") {{ todo.description }}
</template>

<script>
	import todoItem from "./todo_list/todo.vue";

	export default {
		data() {
			return {

			};
		},

		computed: {
			todos() {
				return this.$store.getters.sortedTodos;
			}
		},

		components: {
			todoItem
		}
	}
</script>

<style lang="scss">

</style>