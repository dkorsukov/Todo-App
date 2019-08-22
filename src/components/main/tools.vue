<template lang="pug">
	v-layout(row, justify-space-between)
		v-select.order-by-select(label="Order by",
						v-model="orderSelectValue"
						:items="orderTypes")
</template>

<script>
	export default {
		data() {
			return {
				orderBy: "" 
			};
		},

		computed: {
			orderSelectValue: {
				get() {
					return this.orderBy;
				},

				set(value) {
					this.$store.commit("setTodosOrder", value);

					this.orderBy = value;
				}
			},

			orderTypes() {
				return this.$store.state.folders.orderTypes.map( (typeObj) => typeObj.type );
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
</style>