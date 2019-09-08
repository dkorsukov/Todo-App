<template lang="pug">
	popup-component(name="creatingFolder",
									ref="creatingFolderPopup",
									:inProgress="inProgress",
									@close="resetForm",
									@confirm="createFolder")
		template(#title)
			v-icon.offset-left(medium) add
			span.offset-all.headline Create folder
		template(#content)
			v-form(ref="creatingFolderForm")
				v-text-field(:disabled="inProgress"
										 label="Folder Name*",
										 :rules="folderNameRules", 
										 v-model="folderName",
										 @keypress.enter="createFolder")
</template>

<script>
	import { mapState } from "vuex";
	import popupComponent from "./popup.vue";

	export default {
		data() {
			return {
				inProgress: false,
				folderName: "",				
				folderNameRules: [
					(val) => val.length > 0 || "Folder name is required",
					(val) => val.length < 14 || "Folder name length should be less than 14 characters",
					(val) => !val.includes("/") || "Folder name should not contain forbidden characters (/)"
				]				
			};
		},

		methods: {
			resetForm() {
				this.$refs.creatingFolderForm.resetValidation();

				// set default values
				this.folderName = "";
			},

			createFolder() {
				if ( ~this.folders.findIndex( (f) => f.name === this.folderName ) ) {
					this.$refs.creatingFolderPopup.showMessage("error", "Folder with this name is already exists");

					return false;
				} else {
					this.$refs.creatingFolderPopup.showMessage("success", "");
				}

				if ( this.$refs.creatingFolderForm.validate() ) {
					this.inProgress = true;

					let now = ( new Date() ).valueOf();

					this.foldersCollectionRef.doc(this.folderName).set({
						created: now,
						todosCount: 0
					})
						.then( () => {
							// add in view list
							this.$store.commit("addFolder", {
								name: this.folderName,
								docRef: this.foldersCollectionRef.doc(this.folderName),
								created: now,
								todosCount: 0
							});

							this.$refs.creatingFolderPopup.close();
						} )
						.catch( (err) => {
							this.$refs.creatingFolderPopup.showMessage("error", err.code);
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
			})
		},

		components: {
			popupComponent
		}
	}
</script>

<style lang="scss">

</style>