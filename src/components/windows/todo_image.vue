<template lang="pug">
	popup-component(name="todoImage", :width="650", :inProgress="false", :confirmBtn="false")
		template(#title)
			span.offset-all.title Click to open
		template(#content)
			a(:href="imgURL")
				v-img(:src="imgURL")
</template>

<script>
	import popupComponent from "./popup.vue";

	export default {
		data() {
			return {

			};
		},

		computed: {
			imgURL() {
				return this.$store.state.windows.todoImageURL;
			}
		},

		components: {
			popupComponent
		}
	}
</script>

<style lang="scss">

</style>