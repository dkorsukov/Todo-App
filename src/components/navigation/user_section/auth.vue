<template lang="pug">
	v-layout(column, justify-center)
		v-flex(md12, align-self-end)
			v-btn(color="primary", small, @click="$store.commit('setCreatingAccountPopup', true)") Sign Up
		v-flex(md12)
			v-alert(type="error", :value="showError") {{ errorText }}			
		v-flex(md12)
			v-form(ref="signInForm")
				v-text-field(label="E-mail", 
										v-model.trim="email", 
										:rules="emailRules",
										@keypress.enter="signIn")
				v-text-field(label="Password", 
										type="password", 
										v-model="password", 
										:rules="passwordRules",
										@keypress.enter="signIn")
				v-btn(color="primary", block, @click="signIn") Sign In
				v-btn(color="primary", flat, block, @click="openPasswordReset") Forgot password?
</template>

<script>
	import api from "@api";

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
							if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
								this.errorText = "Incorrent e-mail or password";
							} else {
								this.errorText = err.code;
							}

							this.$store.commit("setUserSectionProgressBar", false);
						} );
				}
			},

			openPasswordReset() {
				this.$store.commit("setResetPasswordPopup", true);
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