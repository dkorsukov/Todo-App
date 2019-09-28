<template lang="pug">
	v-list(one-line, subheader)
		v-subheader.subheading.justify-space-between
			span Folders
			v-progress-circular(indeterminate, 
													:size="22",
													:width="3",
													v-if="progressBar",
													color="rgba(130, 130, 130, 0.75)")
		folder(v-for="(folder, index) in folders", :key="index", 
					:index="index"
					:name="folder.name")
		v-list-tile.create-folder-btn(v-if="isFoldersLoaded")
			v-list-tile-content
				v-btn(color="primary", block, small, 
							:disabled="!isFoldersLoaded",
							@click="$store.commit('setCreatingFolderPopup', true)")
					v-icon.mr-1 add
					span.mr-3 Create
</template>

<script>
	import { mapState } from "vuex";
	import folder from "./folders/folder.vue";

	export default {
		data() {
			return {

			};
		},

		computed: {
			...mapState({
				isFoldersLoaded: (state) => state.folders.isFoldersLoaded,
				folders: (state) => state.folders.list,
				progressBar: (state) => state.bars.foldersListSection
			})
		},

		components: {
			folder
		}
	}
</script>

<style lang="scss">

</style>