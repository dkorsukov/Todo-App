<template lang="pug">
	v-app(:dark="darkTheme")
		navigation(:temporary="mobile")
		toolbar(v-if="mobile")
		main-section
		windows
</template>

<script>
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
			darkTheme() {
				return this.$store.state.darkTheme;
			},

			mobile() {
				return this.vw < this.$store.state.mobileBreakPoint;
			}
		},

		mounted() {
			// get theme from local storage
			let themeFromLocal = JSON.parse( localStorage.getItem("todo-app/user-data/dark-theme") );

			if (typeof themeFromLocal === "boolean") {
				this.$store.commit("setDarkTheme", themeFromLocal);
			}

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
	html, body {
		min-width: 320px;
	}
</style>