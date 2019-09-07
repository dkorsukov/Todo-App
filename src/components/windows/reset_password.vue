<template lang="pug">
	popup-component(name="resetPassword",
									ref="resetPasswordPopup",
									:inProgress="inProgress",
									@close="$refs.resetPasswordForm.reset()",
									@confirm="resetPassword")
		template(#title)
			v-icon.offset-left(medium) refresh
			span.offset-all.headline Reset password
		template(#content)
			v-form(ref="resetPasswordForm")
				v-text-field(:disabled="inProgress",
										:rules="emailRules", label="E-mail*", 
										v-model="emailInputValue",
										@keypress.enter="resetPassword")
</template>

<script>
	import api from "@api";
	import popupComponent from "./popup.vue";

	export default {
		data() {
			return {
				inProgress: false,
				messageText: "",
				messageType: "",
				emailRules: [
					(val) => !!val ? /(.+)@(.+)\.(.+)/.test(val) || "Enter a valid e-mail address" : "E-mail is required"
				],
				emailInputValue: ""
			};
		},

		methods: {
			resetPassword() {
				if ( this.$refs.resetPasswordForm.validate() ) {
					this.inProgress = true;

					api.auth.sendPasswordResetEmail(this.emailInputValue)
						.then( () => {
							this.$refs.resetPasswordPopup.showMessage("success", "Check your e-mail");
						} )
						.catch( (err) => {
							let errorText = err.code.replace("auth/", "");

							this.$refs.resetPasswordPopup.showMessage("error", errorText);
						} )
						.finally( () => {
							this.inProgress = false;
						} );
				}		
			}			
		},

		components: {
			popupComponent
		}
	}
</script>

<style lang="scss">

</style>