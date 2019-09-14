<template lang="pug">
	v-container.pa-0.relative.user-section(fluid)
		.progress-container(v-if="sectionProgressBar")
			v-progress-circular.user-section-progress(indeterminate, :size="30")
		user-auth(v-if="!isLogged")
		user-info(v-if="isLogged")
</template>

<script>
	import { mapState } from "vuex";
	import api from "@api";
	import userAuth from "./user_section/auth.vue";
	import userInfo from "./user_section/info.vue";

	export default {
		data() {
			return {

			};
		},

		computed: {
			...mapState({
				isLogged: (state) => state.user.isLogged,
				sectionProgressBar: (state) => state.bars.userSection
			})
		},

		components: {
			userAuth, userInfo
		},
		
		mounted() {
			api.auth.onAuthStateChanged( (user) => {
				if (user) {
					this.$store.dispatch("signIn", user.email);
				} 

				this.$store.commit("setUserSectionProgressBar", false);
			} );
		}		
	}
</script>

<style lang="scss">
	.user-section-progress {
		color: rgb(117, 117, 150);

		.theme--dark & {
			color: rgb(182, 182, 182);
		}
	}

	.relative {
		position: relative;
	}

	.progress-container {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
		background-color: rgba(169, 169, 169, 0.5);
	}
</style>