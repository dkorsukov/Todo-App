<template lang="pug">
	v-layout(column, justify-center)
		v-flex(align-self-end)
			v-btn(small, :color="mainColor", @click="signOut") Sign Out
		v-layout.mt-3(row, align-center)
			v-avatar(:color="mainColor")
				span.white--text.headline {{ userInitials }}
			v-layout.ml-3.mt-2(column)
				span.title {{ userName }}
				span.user-email(:title="userEmail") ({{ userEmail.substr(0, 26) }})
				span.body-1.font-weight-thin(title="Registration date") Since {{ userRegDate }}
</template>

<script>
	import api from "@api";
	import { mapState, mapGetters } from "vuex";

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
				userDocRef: (state) => state.user.docRef,
				userName: (state) => state.user.name,
				userRegDate: (state) => state.user.registered
			}),

			mainColor() {
				let colors = ["primary"];
				return colors[ ~~( Math.random() * colors.length ) ];
			},

			userEmail() {
				return this.userDocRef.id;
			}
		}
	}
</script>

<style lang="scss">
	.user-email {
		color: rgba(0, 0, 0, 0.54);
	}
</style>