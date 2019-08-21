<template lang="pug">
	v-list-tile.folder-elem(avatar, v-ripple="!showRemoveMenu", :disabled="inProgress",	:class=" selected ? 'folder-elem--active' : '' ")
		v-list-tile-avatar(@click="selectFolder")
			v-icon(size="25") folder
		v-list-tile-content(@click="selectFolder")
			v-list-tile-title {{ name }}
		v-list-tile-action.tile-action
			v-tooltip(bottom, v-model="showInfo")
				template(#activator="{ on }")
					v-btn(icon, ripple,
								@click="getInfo", 
								@mouseleave="showInfo = false")
						v-icon(color="rgba(0, 0, 0, 0.54)") info
				div(v-if="isDataLoaded")
					span Created {{ created.toLocaleString() }}
					br
					span Contains {{ todosCount }} todo
				v-progress-circular(indeterminate,
														v-else, 
														:size="18",
														:width="2",
														color="rgba(190, 190, 190, 0.75)")
		v-list-tile-action.tile-action
			v-btn(icon, 
						ripple, 
						flat, 
						color="rgba(0, 0, 0, 0.54)",
						@click="showRemoveMenu = true")
				v-icon delete
		.remove-menu-container(v-if="showRemoveMenu")
			v-btn(color="primary", flat, small, @click="showRemoveMenu = false") Cancel
			v-btn(color="primary", small, @click="removeFolder") Delete
</template>

<script>
	import { mapState } from "vuex";

	export default {
		props: {
			index: Number,
			name: String
		},

		data() {
			return {
				inProgress: false,
				showRemoveMenu: false,
				showInfo: false
			};
		},

		methods: {
			selectFolder() {
				if (this.selected) {
					return false;
				}

				this.$store.dispatch("switchCurrentFolder", this.index);
			},

			removeFolder() {
				this.inProgress = true;
				this.showRemoveMenu = false;

				this.folders[this.index].docRef.delete()
					.then( () => {
						// process removal from list in database listener (folders.js)
					} )
					.finally( () => {
						this.inProgress = false;
					} )
			},

			getInfo() {
				this.showInfo = true;

				if (this.isDataLoaded) {
					return true;
				}

				this.folders[this.index].docRef.get()
					.then( (folder) => {
						let folderData = folder.data();
						this.$store.commit("setFolderCreated", {
							folderIndex: this.index,
							value: folderData.created
						});
						this.$store.commit("setFolderTodosCount", {
							folderIndex: this.index,
							value: folderData.todosCount
						});
					} );
			}
		},

		computed: {
			...mapState({
				currentFolderIndex: (state) => state.folders.currentFolderIndex,
				folders: (state) => state.folders.list
			}),
			
			created() {
				return this.folders[this.index].created;
			},

			todosCount() {
				return this.folders[this.index].todosCount;
			},

			isDataLoaded() {
				return this.created !== null && this.todosCount !== null;
			},

			selected() {
				return this.index === this.currentFolderIndex;
			}
		}
	}
</script>

<style lang="scss">
	.folder-elem {
		transition: background-color 0.8s;
		cursor: pointer;

		&.folder-elem--active {
			background: rgba(0, 0, 0, 0.12);
		}

		&:hover {
			background-color: rgba(0, 0, 0, 0.14);
		}
	}

	.tile-action {
		min-width: 40px;
	}

	.remove-menu-container {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(220, 220, 220, 0.95);
	}
</style>
