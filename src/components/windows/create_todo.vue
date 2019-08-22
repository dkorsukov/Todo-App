<template lang="pug">
	v-dialog(v-model="visible", :persistent="true", :maxWidth="700")
		v-card
			v-card-title
				v-icon.offset-left(medium) add
				span.offset-all.headline Create Task
			v-divider
			v-alert(type="error", :value="showError") Error: {{ errorText }}
			v-container(fluid, pa-1, grid-list-md)
				v-card-text
					v-layout(row, justify-center, align-center)
						v-flex(md11)
							v-form(ref="creatingTodoForm")
								v-text-field(v-model="titleInputValue", label="Title")
								v-slider(v-model="priorityInputValue", :thumb-size="25",
												:min="1", :max="9", label="Priority")
									template(#thumb-label)
										span {{ priorityInputValue }}
								v-textarea(label="Description",
													v-model="descriptionInputValue")
								v-radio-group(v-model="timeMode", row)
									v-radio(color="primary", label="Until", :value="0")
									v-radio(color="primary", label="Interval", :value="1")
								.until(v-if="until")
									v-layout(row)
										v-flex(md5)
											v-menu(:close-on-content-click="true")
												template(#activator="{ on }")
													v-text-field(v-model="untilDatePickerValue", v-on="on",
																			readonly, prepend-icon="date_range",
																			label="Select Date")
												v-date-picker(v-model="untilDatePickerValue", 
																			color="primary", no-title, scrollable)
										v-flex.ml-1(md5)
											v-menu(:close-on-content-click="false", ref="timePickerMenu")
												template(#activator="{ on }")
													v-text-field(v-model="untilTimePickerValue", v-on="on",
																			readonly, prepend-icon="access_time",
																			label="Select Time")
												v-time-picker(v-model="untilTimePickerValue", 
																			color="primary", scrollable,
																			@click:minute="$refs.timePickerMenu.save(untilTimePickerValue)")
								.interval(v-if="interval")
					v-layout(row, justify-end)
						v-btn(flat, :disabled="inProgress", @click="visible = false") Cancel
						v-btn(color="primary", :disabled="inProgress", :loading="inProgress", @click="createTodo") Confirm	
</template>

<script>
	export default {
		data() {
			return {
				inProgress: false,
				errorText: "",
				titleInputValue: "",
				priorityInputValue: 1,
				descriptionInputValue: "",
				timeMode: 0,
				untilDatePickerValue: "",
				untilTimePickerValue: ""
			};
		},

		methods: {
			createTodo() {

			}
		},

		computed: {
			visible: {
				get() {
					return this.$store.state.windows.creatingTodo;
				},

				set(value) {
					this.$store.commit("setCreatingTodoPopup", !!value);
				}
			},

			until() {
				return this.timeMode === 0;
			},
			
			interval() {
				return this.timeMode === 1;
			},

			showError() {
				return !!( this.errorText.trim() );
			}
		}
	}
</script>

<style lang="scss">

</style>