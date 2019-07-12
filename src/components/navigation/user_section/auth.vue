<template lang="pug">
	v-layout(column, justify-center)
		v-flex(md12, align-self-end)
			v-btn(color="primary", small, @click="$store.commit('openCreatingAccountPopup')") Sign Up
		v-flex(md12)
			v-alert(type="error", :value="showError") {{ errorText }}			
		v-flex(md12)
			v-form(ref="signInForm")
				v-text-field(label="E-mail", 
										v-model.trim="email", 
										:rules="emailRules")
				v-text-field(label="Password", 
										type="password", 
										v-model="password", 
										:rules="passwordRules")
				v-btn(color="primary", block, @click="signIn") Sign In
				v-btn(color="primary", flat, block) Forgot password?
</template>

<script>
	import api from "@api/index.js";

	export default {
		data() {
			return {
				errorText: "",
				email: "",
				password: "",
				emailRules: [
					(val) => !!val || "E-mail is required",
					(val) => /(.+)@(.+)\.(.+)/.test(val) || "Enter a valid e-mail address"
				],
				passwordRules: [
					(val) => !!val || "Password is required"
				]
			};
		},

		methods: {
			signIn() {
				if ( this.$refs.signInForm.validate() ) {
					this.$store.commit("setUserSectionProgressBar", true);

					api.signInUser(this.email, this.password)
						.catch( (err) => {
							switch (err.code) {
								case "auth/wrong-password":
									this.errorText = "Incorrent e-mail or password";
								break;
								case "auth/user-not-found":
									this.errorText = "Incorrent e-mail or password";
								break;
								default:
									this.errorText = "Error";		
							}
						} );
				}
			}
		},

		computed: {
			showError() {
				return !!( this.errorText.trim() );
			}
		}
	}
</script>

<style lang="scss">

</style>