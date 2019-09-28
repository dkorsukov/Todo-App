<template lang="pug">
	popup-component(name="creatingTodo",
									ref="creatingTodoPopup",
									:inProgress="inProgress",
									@close="resetForm",
									@confirm="createTodo")
		template(#title)
			v-icon.offset-left.mr-1(medium) add
			span.offset-all.headline Create new task
		template(#content)
			v-form(ref="creatingTodoForm")
				v-text-field(v-model="titleInputValue", 
										label="Title*",
										:rules="titleInputRules",
										:disabled="inProgress")
				v-textarea(label="Description",
									v-model="descriptionInputValue",
									:counter="true",
									:max-length="150",
									:rules="descriptionInputRules",
									:disabled="inProgress")
				v-radio-group(v-model="todoTimeMode",
											:rules="todoTimeModePickerRules", 
											row, :disabled="inProgress")
					v-radio(color="primary", label="Once", :value="0")
					v-radio(color="primary", label="Interval", :value="1")
				v-layout(row)
					v-flex(md5)
						v-menu(:close-on-content-click="true")
							template(#activator="{ on }")
								v-text-field(v-model="datePickerValue", v-on="on",
														readonly, prepend-icon="date_range",
														:rules="dateInputRules",
														:disabled="inProgress",
														label="Select Date*")
							v-date-picker(v-model="datePickerValue",
														color="primary", no-title, scrollable)
					v-flex.ml-1(md5)
						v-menu(:close-on-content-click="false", ref="timePickerMenu")
							template(#activator="{ on }")
								v-text-field(v-model="timePickerValue", v-on="on",
														readonly, prepend-icon="access_time",
														:rules="timeInputRules",
														:disabled="inProgress",
														label="Select Time*")
							v-time-picker(v-model="timePickerValue", 
														color="primary", scrollable,
														@click:minute="$refs.timePickerMenu.save(timePickerValue)")
				.interval-settings(v-if="todoTimeMode === 1")
					v-layout.ml-2(row)
						v-text-field.interval-value-input(label="Every*",
																							v-model="intervalNumberValue",
																							:rules="intervalValueInputRules")
						v-select.ml-2.interval-units-select(:items="intervalSelectItems",
																								v-model="intervalSelectValue")
				.file-input-container
					input(type="file", hidden, @input="attachFile", ref="realFileInput")
					v-text-field(label="Attach Image", :disabled="inProgress", :rules="fileRules", :value="attachedFileName", readonly, @click="dispatchFileInput")
</template>

<script>
	import api from "@api";
	import { mapState, mapGetters } from "vuex";
	import popupComponent from "./popup.vue";

	export default {
		data() {
			return {
				inProgress: false,
				titleInputValue: "",
				descriptionInputValue: "",
				todoTimeMode: -1,
				datePickerValue: "",
				timePickerValue: "",
				intervalNumberValue: "10",
				attachedFileName: "",
				attachedFile: null,
				titleInputRules: [
					(val) => val.length > 0 || "Title is required",
					(val) => val.length <= 30 || "Title should not be longer than 30 characters"
				],
				descriptionInputRules: [
					(val) => val.length <= 80 || "Description length should be less than or equal 80 characters"
				],
				todoTimeModePickerRules: [
					(val) => val >= 0 || "Choose the mode"
				],				
				dateInputRules: [
					(val) => !!val || "Date is required"
				],
				intervalValueInputRules: [
					(val) => ( !isNaN(val) && val % 1 === 0 && val > 0 && val <= 10000 ) || "Enter a positive integer not bigger than 10000"
				],
				intervalSelectItems: ["minutes", "hours", "days"],
				intervalSelectValue: "hours"
			};
		},

		methods: {
			resetForm() {
				this.$refs.creatingTodoForm.resetValidation();

				// set a default values
				this.titleInputValue = "";
				this.descriptionInputValue = "";
				this.todoTimeMode = -1;
				this.datePickerValue = "";
				this.timePickerValue = "";
				this.intervalNumberValue = "10";
				this.attachedFileName = "";
				this.attachedFile = null;
				this.intervalSelectValue = "hours";
			},

			dispatchFileInput() {
				this.$refs.realFileInput.click();
			},

			attachFile() {
				let rif = this.$refs.realFileInput.files;

				this.attachedFileName = rif[rif.length - 1].name;
				this.attachedFile = rif[rif.length - 1];
			},

			createTodo() {
				if ( this.$refs.creatingTodoForm.validate() ) {
					let titleIndex = this.currentTodos.findIndex( (todoObj) => {
						return todoObj.title === this.titleInputValue;
					} );

					// if doc with this title isn't exist
					if (titleIndex === -1) {
						this.inProgress = true;

						let hasImage = this.attachedFile !== null;

						let docData = {
							created: ( new Date() ).valueOf(),
							title: this.titleInputValue,
							description: this.descriptionInputValue,
							hasImage,
							time: ( new Date(`${this.datePickerValue} ${this.timePickerValue}`) ).valueOf()
						};

						if (this.todoTimeMode === 1) {
							let everyNum = parseInt( this.intervalNumberValue );

							switch (this.intervalSelectValue) {
								case "minutes":
									everyNum *= 1000 * 60;
								break;
								case "hours":
									everyNum *= 1000 * 60 * 60;
								break;
								case "days":
									everyNum *= 1000 * 60 * 60 * 24;
								break;
							};

							docData.interval = {
								doneTimes: 0,
								every: everyNum,
								everyUnits: this.intervalSelectValue,
								lastFinished: docData.time
							};
						} else if (this.todoTimeMode === 0) {
							docData.single = {
								done: false,
								doneTime: 0
							};
						}

						// encode for safety usage of some chars (/, $, #, etc)
						let	encodedTitle = encodeURIComponent(this.titleInputValue);

						this.currentTodosCollectionRef.doc(encodedTitle)
							.set(docData)
							.then( () => {
								let newDoc = this.currentTodosCollectionRef.doc(docData.title);
								
								// add in current view list
								this.$store.commit("addTodo", {
									docRef: newDoc,
									...docData
								});

								this.$store.dispatch("changeTodosCount", 1);

								if (this.attachedFile !== null) {
									api.storage.child(`${api.auth.currentUser.uid}/${docData.created}`).put(this.attachedFile)
										.then( () => {

										} )
										.finally( () => {
											this.inProgress = false;
											this.$refs.creatingTodoPopup.close();
										} );
								} else {
									this.inProgress = false;
									this.$refs.creatingTodoPopup.close();
								}
							} )
							.catch( (err) => {
								this.inProgress = false;
								this.$refs.creatingTodoPopup.showMessage("error", err.code);
							} )
					} else {
						this.$refs.creatingTodoPopup.showMessage("error", "Task with this title is already exists in this folder");
					}
				}
			}
		},

		computed: {
			...mapState({
				currentFolderDocRef: (state) => state.folders.currentFolderDocRef,
				currentFolderIndex: (state) => state.folders.currentFolderIndex,
				currentTodos: (state) => state.folders.currentTodos
			}),

			...mapGetters(["currentFolderObj", "currentTodosCollectionRef"]),

			timeInputRules() {
				let dpv = this.datePickerValue;

				if (dpv) {
					return [
						(val) => val ? ( new Date(`${dpv} ${val}`) > +new Date() + 6e5 || "Selected date and time should be at least 10 minutes later than now" ) : "Time is required" 
					];
				} else {
					return [
						(val) => true
					];
				}
			},

			fileRules() {
				return [
					(val) => this.attachedFile ? (this.attachedFile.size / 1024 / 1024 <= 3 || "File shouldn't be bigger than 3MB") : true,
					(val) => this.attachedFile ? (this.attachedFile.type.includes("image") || "File should be image") : true
				];
			}
		},

		components: {
			popupComponent
		}
	}
</script>

<style lang="scss">
	.interval-value-input {
		max-width: 100px;
		margin-left: 20px;
	}

	.interval-units-select {
		max-width: 100px;
	}
</style>