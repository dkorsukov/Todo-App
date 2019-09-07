<template lang="pug">
	v-navigation-drawer.main-nav(v-model="visible", :mobile-break-point="$store.state.mobileBreakPoint", app)
		.main-nav__content
			user-section
			v-divider
			folders
</template>

<script>
	import api from "@api";
	import userSection from "./navigation/user.vue";
	import folders from "./navigation/folders.vue";

	export default {
		data() {
			return {

			};
		},

		components: {
			userSection, folders
		},

		computed: {
			visible: {
				get() {
					return this.$store.state.navigationVisibility;
				},

				set(value) {
					this.$store.commit("setNavigationVisibility", !!value);
				}
			}
		},

		mounted() {
			if (window.innerWidth > this.$store.state.mobileBreakPoint) {
				this.visible = true;
			}
		}
	}
</script>

<style lang="scss">
	.main-nav__content {
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;

		&::-webkit-scrollbar {
			width: 5px;

			&-track {
				border-left: 1px solid rgba(0, 0, 0, .12);
			}

			&-thumb {
				width: 100%;
				background-color: rgba(155, 155, 155, 0.8);
			}
		}
	}
</style>