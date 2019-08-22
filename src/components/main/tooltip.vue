<template lang="pug">
	.main-section__tooltip
		span.tooltip__text {{ tooltipText }}
</template>

<script>
	import { mapState } from "vuex";

	export default {
		data() {
			return {

			};
		},

		computed: {
			...mapState({
				isFoldersLoaded: (state) => state.folders.isFoldersLoaded,
				currentFolderIndex: (state) => state.folders.currentFolderIndex,
				currentTodos: (state) => state.folders.currentTodos
 			}),

			tooltipText() {
				if (this.isFoldersLoaded) {
					if (this.currentFolderIndex === null) {
						return "Select folder";
					} else if (this.currentTodos.length === 0) {
						return "Create task";
					}
				} else {
					return "";
				}
			}
		}
	}
</script>

<style lang="scss">
	.main-section__tooltip {
		width: 100%;
		text-align: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		z-index: 1;
	}

	.tooltip__text {
		font-size: 28px;
		color: rgba(0, 0, 0, 0.35);

		@media screen and (max-width: 560px) {
			font-size: 20px;
		}
	}
</style>