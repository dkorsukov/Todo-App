<template lang="pug">
	v-toolbar.pa-1(color="primary")
		v-btn(icon, flat, large, color="white",
					@click="showNavigation")
			v-icon(medium, color="white") menu
		v-toolbar-title.white--text Todo-App
</template>

<script>
	export default {
		data() {
			return {

			};
		},

		methods: {
			showNavigation() {
				this.$store.commit("setNavigationVisibility", true);
			}
		}
	}
</script>

<style lang="scss">

</style>