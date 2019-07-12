<template lang="pug">
	v-dialog(v-model="visible", :maxWidth="700", :persistent="true")
		v-card
			v-card-title
				v-icon.offset-left(medium) person
				span.offset-all.headline Create new account
			v-divider
			v-alert(type="error", :value="showError") Error {{ errorText }}
			v-container(fluid, pa-1, grid-list-md)
				v-card-text
					v-layout(row, justify-center, align-center)
						v-flex(md11)
							v-form(ref="creatingAccountForm")
								v-text-field(:disabled="inProgress", label="Name*", :rules="nameRules", v-model="name")
								v-text-field(:disabled="inProgress", label="E-mail*", :rules="emailRules", v-model="email")
								v-text-field(:disabled="inProgress", type="password", :rules="passwordRules", label="Password*", v-model="password")
								v-text-field(:disabled="inProgress", type="password", :rules="repeatRules", label="Repeat your password*")
					v-layout(row, justify-end)
						v-btn(flat, :disabled="inProgress", @click="visible = false") Cancel
						v-btn(color="primary", :disabled="inProgress", :loading="inProgress", @click="createAccount") Confirm
</template>

<script>
	import api from "@api/index.js";

	export default {
		data() {
			return {
				inProgress: false,
				errorText: "",
				nameRules: [
					(val) => ( !!val && !!(val).toString().trim() ) || "Name is required"
				],
				emailRules: [
					(val) => !!val ? /(.+)@(.+)\.(.+)/.test(val) || "Enter a valid e-mail address" : "E-mail is required"
				],
				passwordRules: [
					(val) => !!val ? (val).toString().length > 6 || "Password is too short" : "Password is required"
				],			
				name: "",
				email: "",
				password: ""
			};
		},

		methods: {
			createAccount() {
				if ( this.$refs.creatingAccountForm.validate() ) {
					this.inProgress = true;

					api.createUser(this.email, this.password, {
						name: this.name,
						registered: ( new Date() ).valueOf()
					}).then( (data) => {
						console.log(data);

						this.visible = false;
					} ).catch( (err) => {
						this.errorText = `${err.code.replace("auth/").split("-").join(" ")}`;
					} ).finally( () => {
						this.inProgress = false;
					} );
				}
			}
		},

		computed: {
			repeatRules() {
				return [
					(val) => this.password ? val === this.password || "Passwords do not match" : false
				];
			},

			showError() {
				return !!( this.errorText.trim() );
			},

			visible: {
				get() {
					return this.$store.state.windows.creatingAccount;
				},

				set(value) {
					if (value === true) {
						this.$store.commit("openCreatingAccountPopup");
					} else {
						this.$store.commit("closeCreatingAccountPopup");

						this.$refs.creatingAccountForm.reset();
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.offset-all {
		margin: 10px;
	}

	.offset-left {
		margin-left: 10px;
	}
</style>