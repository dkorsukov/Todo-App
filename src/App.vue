<template lang="pug">
	v-app
		v-container(fluid, pa-0)
			v-layout(row)
				navigation
</template>

<script>
	import navigation from "@components/navigation.vue";

	export default {
		data() {
			return {
				
			};
		},

		components: {
			navigation
		}
	}
</script>


<style lang="scss">

</style>