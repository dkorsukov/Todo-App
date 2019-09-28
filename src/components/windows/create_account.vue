<template lang="pug">
	popup-component(name="creatingAccount",
									ref="creatingAccountPopup",
									:inProgress="inProgress",
									@close="$refs.creatingAccountForm.reset()",
									@confirm="createAccount")
		template(#title)
			v-icon.offset-left.mr-1(medium) person
			span.offset-all.headline Create new account
		template(#content)
			v-form(ref="creatingAccountForm")
				v-text-field(:disabled="inProgress", label="Name*", :rules="nameRules", v-model="name")
				v-text-field(:disabled="inProgress", label="E-mail*", :rules="emailRules", v-model="email")
				v-text-field(:disabled="inProgress", type="password", :rules="passwordRules", label="Password*", v-model="password")
				v-text-field(:disabled="inProgress", type="password", :rules="repeatRules", label="Repeat your password*")
</template>

<script>
	import api from "@api";
	import popupComponent from "./popup.vue";

	export default {
		data() {
			return {
				inProgress: false,
				nameRules: [
					(val) => ( !!val && !!(val).toString().trim() ) ? ( val.length <= 15 || "Name should not be longer than 15 characters" ) : "Name is required"
				],
				emailRules: [
					(val) => !!val ? /(.+)@(.+)\.(.+)/.test(val) || "Enter a valid e-mail address" : "E-mail is required"
				],
				passwordRules: [
					(val) => !!val ? ( (val).toString().length > 6 || "Password is too short" ) : "Password is required"
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
						email: this.email,
						registered: ( new Date() ).valueOf()
					}).then( (data) => {
						this.$refs.creatingAccountPopup.close();
					} ).catch( (err) => {
						let errorText = `${err.code.replace("auth/", "").split("-").join(" ")}`;

						this.$refs.creatingAccountPopup.showMessage("error", errorText);
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
			}			
		},

		components: {
			popupComponent
		}
	}
</script>

<style lang="scss">

</style>