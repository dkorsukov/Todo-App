<template lang="pug">
	v-content
		v-container.main-content__container(fluid, pa-4)
			tooltip
			v-progress-linear.main-section__progress(v-if="progressBar", 
																							color="primary",
																							:height="4" 
																							indeterminate)
			.app-settings-btn-wrapper
				v-btn.app-settings-btn(icon, large, @click="openAppSettings")
					v-icon.app-settings-btn__icon settings_application
			tools
			todo-list
			v-speed-dial.create-todo-btn(fixed, bottom, right, 
																	v-if="isCurrentFolderLoaded")
				template(#activator)
					v-btn(fab, color="primary", @click='$store.commit("setCreatingTodoPopup", true)')
						v-icon(:size="30") add
</template>

<script>
	import { mapState } from "vuex";
	import tooltip from "./main/tooltip.vue";
	import tools from "./main/tools.vue";
	import todoList from "./main/todo_list.vue"; 

	export default {
		data() {
			return {

			};
		},

		methods: {
			openAppSettings() {
				this.$store.commit("setAppSettingsPopup", true);
			}
		},

		computed: {
			...mapState({
				isCurrentFolderLoaded: (state) => state.folders.isCurrentFolderLoaded,
				currentFolderIndex: (state) => state.folders.currentFolderIndex,
				progressBar: (state) => state.bars.mainSection
			})
		},

		components: {
			tooltip, tools, todoList
		}
	}
</script>

<style lang="scss">
	.main {
		width: 100%;

		&-section__progress {
			position: absolute;
			width: 100%;
			left: 0;
			top: 0;
			margin: 0!important;
		}

		&-content__container {
			position: relative;
			min-height: 100%;
		}
	}

	.order-select {
		margin-top: -15px;
		margin-left: 10px;
		max-width: 85px;
	}

	.normal-size {
		font-size: 16px;
	}

	.app-settings-btn {
		&-wrapper {
			overflow: hidden;
			position: absolute;
			top: 10px;
			right: 10px;
		}

		&__icon {
			max-width: 24px;
		}
	}

	.create-todo-btn {
		right: 32px;
		bottom: 32px;

		@media screen and (max-width: 621px) {
			right: 16px;
			bottom: 16px;
		}
	}
</style>
