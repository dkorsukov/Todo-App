<template lang="pug">
	v-dialog(v-model="visible", :persistent="true", :maxWidth="700")
		v-card
			v-card-title
				v-icon.offset-left(medium) add
				span.offset-all.headline Create folder
			v-divider
			v-alert(type="error", :value="showError") Error: {{ errorText }}
			v-container(fluid, pa-1, grid-list-md)
				v-card-text
					v-layout(row, justify-center, align-center)
						v-flex(md11)
							v-form(ref="creatingFolderForm")
								v-text-field(:disabled="inProgress", 
														 label="Folder Name*", 
														 :rules="folderNameRules", 
														 v-model="folderName",
														 @keypress.enter="createFolder")
					v-layout(row, justify-end)
						v-btn(flat, :disabled="inProgress", @click="visible = false") Cancel
						v-btn(color="primary", :disabled="inProgress", :loading="inProgress", @click="createFolder") Confirm			
</template>

<script>
	import api from "@api/index.js";
	import { mapState } from 'vuex';

	export default {
		data() {
			return {
				inProgress: false,
				folderName: "",
				errorText: "",
				folderNameRules: [
					(val) => val ? (val.length < 14 || "Folder name length should be less than 14 characters") : "Folder name is required"
				]
			};
		},

		methods: {
			createFolder() {
				if ( ~this.folders.findIndex( (f) => f.name === this.folderName ) ) {
					this.errorText = "Folder with this name is already exists";

					return false;
				} else {
					this.errorText = "";
				}

				if ( this.$refs.creatingFolderForm.validate() ) {
					this.inProgress = true;

					let now = ( new Date() ).valueOf();

					this.foldersCollectionRef.doc(this.folderName).set({
						created: now,
						todosCount: 0
					})
						.then( () => {
							this.$store.commit("addFolder", {
								name: this.folderName,
								docRef: this.foldersCollectionRef.doc(this.folderName),
								created: now,
								todosCount: 0
							});

							this.visible = false;
						} )
						.catch( (err) => {
							this.errorText = err.code;
						} )
						.finally( () => {
							this.inProgress = false;
						} );
				}		
			}
		},

		computed: {
			...mapState({
				foldersCollectionRef: (state) => state.folders.foldersCollectionRef,
				folders: (state) => state.folders.list
			}),

			visible: {
				get() {
					return this.$store.state.windows.creatingFolder;
				},

				set(value) {
					this.$store.commit("setCreatingFolderPopup", !!value);

					if (!value) {
						this.$refs.creatingFolderForm.reset();
					}					
				}
			},
			showError() {
				return !!this.errorText.trim();
			}
		}
	}
</script>

<style lang="scss">

</style>
