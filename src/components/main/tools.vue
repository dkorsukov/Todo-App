<template lang="pug">
	v-layout(row, justify-space-between, align-center)
		v-select.order-by-select(label="Order by",
						v-if="showOrderSelect",
						v-model="orderSelectValue"
						:items="orderTypes")
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
				currentFolderIndex: (state) => state.folders.currentFolderIndex
			}),

			orderTypes() {
				return this.$store.state.folders.orderTypes.map( (typeObj) => typeObj.type );
			},

			orderSelectValue: {
				get() {
					return this.$store.state.folders.todosOrder;
				},

				set(value) {
					this.$store.commit("setTodosOrder", value);
				}
			},

			showOrderSelect() {
				return this.currentFolderIndex !== null;
			}
		},

		mounted() {
			let savedOrder = localStorage.getItem("todo-app/user-data/order-by");

			if (savedOrder) {
				this.orderSelectValue = savedOrder;
			} else {
				this.orderSelectValue = this.orderTypes[0];
			}
		}
	}
</script>

<style lang="scss">
	.order-by-select {
		max-width: 120px;
	}

	.settings-open-btn-icon {
		max-width: 24px;
	}
</style>