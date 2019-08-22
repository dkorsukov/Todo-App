<template lang="pug">
	v-card.todo-item.ma-2(v-ripple)
		v-card-title
			v-avatar(:color="priorityColor", :size="25")
				span.white--text {{ priority }}
			span.ml-2 {{ title }}
		v-card-text
			slot
</template>

<script>
	export default {
		props: {
			priority: Number,
			title: String
		},

		data() {
			return {

			};
		},

		computed: {
			priorityColor() {
				if (this.priority >= 8 && this.priority <= 9) {
					return "#C92B36";
				} else if (this.priority >= 4 && this.priority < 8) {
					return "#5B649F";
				} else if (this.priority < 4) {
					return "#8790CB";
				}
			}
		}
	}
</script>

<style lang="scss">
	.todo-item {
		cursor: pointer;

		&:hover {
			background-color: rgba(131, 131, 131, 0.14);
		}

		@media screen and (max-width: 560px) {
			width: 100%;
		}

		@media screen and (min-width: 561px) {
			width: calc(100% / 12 * 6 - 16px);
		}

		@media screen and (min-width: 959px) {
			width: calc(100% / 12 * 4 - 16px);
		}

		@media screen and (min-width: 1690px) {
			width: calc(100% / 12 * 3 - 16px);
		}

		@media screen and (min-width: 2161px) {
			width: calc(100% / 12 * 2.4 - 16px);
		}
	}
</style>