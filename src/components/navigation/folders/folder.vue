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
					span Contains {{ todosCount }} item(-s)
				.folder-elem__info-progress-container(v-else)
					v-progress-circular(indeterminate,
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
		v-tooltip(bottom, v-model="showRemoveError")
			template(#activator="{ on }")
				.remove-menu-container(v-if="showRemoveMenu")
					v-btn(color="primary", flat, small, @click="showRemoveMenu = false") Cancel
					v-btn(color="primary", small, @click="removeFolder") Delete
			span Folder should be empty		
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
				showInfo: false,
				showRemoveError: false
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

				// if there are no items then remove folder
				this.folders[this.index].docRef.collection("todos").get()
					.then( (collection) => {
						if (!collection.docs.length) {
							this.folders[this.index].docRef.delete()
								.then( () => {
									/* 	
											process of removal from view list 
											you can find in file called folders.js
									*/
								} )
								.finally( () => {
									this.inProgress = false;
								} )
						} else {
							this.showRemoveError = true;

							setTimeout( () => {
								this.showRemoveError = false;
								this.showRemoveMenu = false;
							}, 1500 );
						}
					} )
					.finally( () => {
						this.inProgress = false;
					} );	
			},

			getInfo() {
				this.showInfo = true;

				if (this.isDataLoaded) {
					return true;
				}

				this.$store.dispatch("getFolderInfo", this.index);
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

		&__info-progress-container {
			width: 180px;
			display: flex;
			justify-content: center;
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

		.theme--dark & {
			background-color: rgba(140, 140, 140, 0.95);
		}
	}
</style>
