<template lang="pug">
	v-container.pa-3.relative(fluid)
		.progress-container(v-if="sectionProgressBar")
			v-progress-circular(indeterminate, :size="30", color="#757596")
		user-auth(v-if="!isLogged")
		user-info(v-if="isLogged")
</template>

<script>
	import { mapState } from "vuex";
	import api from "@api/index.js";
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
		}	
	}
</script>

<style lang="scss">
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