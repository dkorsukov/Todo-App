<template lang="pug">
	popup-component(name="appSettings", :inProgress="inProgress", :width="400", :contentCols="11", :confirmBtn="false")
		template(#title)
			span.offset-all.ml-2.headline App settings
		template(#content)
			v-list(one-line, subheader)
				v-subheader Interface
				v-list-tile
					v-switch(label="Dark theme", color="primary", v-model="appDarkTheme")
</template>

<script>
	import popupComponent from "./popup.vue";

	export default {
		data() {
			return {
				inProgress: false
			}
		},

		computed: {
			appDarkTheme: {
				get() {
					return this.$store.state.darkTheme;
				},

				set(value) {
					this.$store.commit("setDarkTheme", !!value);
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