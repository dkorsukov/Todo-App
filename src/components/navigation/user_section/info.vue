<template lang="pug">
	v-menu(absolute, offset-y, :disabled="inProgress")
		template(#activator="{ on }")
			v-layout.pa-3.user-info-container(column, justify-center, v-ripple, v-on="on")
				v-layout.mt-3(row, align-center)
					v-avatar(:color="mainColor")
						span.white--text.headline {{ userInitials }}
					v-layout.ml-3.mt-2(column)
						span.title {{ userName }}
						span.user-email(:title="changedEmail") {{ changedEmail }}
						span.body-1.font-weight-thin(title="Registration date") Since {{ userRegDate }}
		v-list
			v-list-tile.account-manage-btn(v-ripple, @click="signOut")
				v-list-tile-title Sign out
			v-list-tile.account-manage-btn(v-ripple, @click="deleteAccount")
				v-list-tile-title Delete account				
</template>

<script>
	import api from "@api";
	import { mapState, mapGetters } from "vuex";

	export default {
		data() {
			return {
				inProgress: false
			};
		},

		methods: {
			signOut() {
				this.inProgress = true;

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
					} )
					.finally( () => {
						this.inProgress = false;
					} );
			},
			
			deleteAccount() {
				this.inProgress = true;

				let userId = api.auth.currentUser.uid;
				api.auth.currentUser.delete()
					.then( () => {
						api.database.collection("users").doc(userId).delete()
							.finally( () => {
								window.location.reload();
							} )
					} )
					.catch( (err) => {
						alert(err);
					} )
					.finally( () => {
						this.inProgress = false;
					} )
			}
		},

		computed: {
			...mapGetters(["userInitials"]),
			...mapState({
				userEmail: (state) => state.user.email,
				userName: (state) => state.user.name,
				userRegDate: (state) => state.user.registered
			}),

			mainColor() {
				let colors = ["primary"];
				return colors[ ~~( Math.random() * colors.length ) ];
			},

			changedEmail() {
				let email = this.userEmail;
				return "";
				return email.length <= 27 ? `(${email})` : email.substr(0, 27) + "...";
			}
		}
	}
</script>

<style lang="scss">
	.user-email {
		color: rgba(0, 0, 0, 0.54);

		.theme--dark & {
			color: rgba(255, 255, 255, 0.54);
		}
	}

	.user-info-container {
		cursor: pointer;
		transition: background-color 0.5s;

		.theme--light &:hover {
			background-color: rgba(0, 0, 0, 0.08);
		}

		.theme--dark &:hover {
			background-color: rgba(255, 255, 255, 0.08);
		}
	}

	.account-manage-btn {
		cursor: pointer;
		transition: background-color 0.5s;

		.theme--light &:hover {
			background-color: rgba(0, 0, 0, 0.08);
		}

		.theme--dark &:hover {
			background-color: rgba(255, 255, 255, 0.08);
		}
	}
</style>