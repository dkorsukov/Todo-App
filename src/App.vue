<template lang="pug">
	v-app
		navigation(:temporary="mobile")
		toolbar(v-if="mobile")
		main-section
		windows
</template>

<script>
	import api from "@api/index.js";
	import toolbar from "@components/toolbar.vue";
	import navigation from "@components/navigation.vue";
	import mainSection from "@components/main.vue";
	import windows from "@components/windows.vue";

	export default {
		data() {
			return {
				vw: window.innerWidth
			};
		},

		computed: {
			mobile() {
				return this.vw < this.$store.state.mobileBreakPoint;
			}
		},

		mounted() {
			window.addEventListener("resize", () => {
				this.vw = window.innerWidth;
			});
		},

		components: {
			toolbar, navigation, mainSection, windows
		}	
	}
</script>


<style lang="scss">

</style>