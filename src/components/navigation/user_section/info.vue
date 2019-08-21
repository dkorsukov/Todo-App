<template lang="pug">
	v-layout(column, justify-center)
		v-flex(align-self-end)
			v-btn(small, :color="mainColor", @click="signOut") Sign Out
		v-layout.mt-3(row)
			v-avatar(:color="mainColor")
				span.white--text.headline {{ userInitials }}
			v-layout.ml-3.mt-2(column)
				span.title {{ userName }}	
				span.body-1.font-weight-thin(title="Registration date") Since {{ userRegDate }}
</template>

<script>
	import { mapState, mapGetters } from "vuex";
	import api from "@api/index.js";

	export default {
		data() {
			return {

			};
		},

		methods: {
			signOut() {
				api.auth.signOut()
					.then( () => {
						// prefix for local storage props
						let prefix = "todo-app/user-data";

						localStorage.removeItem(`${prefix}/name`);
						localStorage.removeItem(`${prefix}/registered`);

						window.location.reload();
					} )
					.catch( (err) => {
						console.log(err);
					} );
			}
		},

		computed: {
			...mapGetters(["userInitials"]),
			...mapState({
				userName: (state) => state.user.name,
				userRegDate: (state) => state.user.registered
			}),

			mainColor() {
				let colors = ["primary"];
				return colors[ ~~( Math.random() * colors.length ) ];
			}
		}
	}
</script>

<style lang="scss">

</style>