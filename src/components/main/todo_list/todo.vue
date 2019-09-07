<template lang="pug">
	v-menu(absolute, offset-y, :max-width="600", :disabled="inProgress")
		template(#activator="{ on }")
			v-card.todo-item.ma-2(ripple, :disabled="inProgress", v-on="on")
				v-card-title.todo-item__title-container.relative
					v-avatar(:color="priorityColor", :size="25")
						span.white--text {{ priority }}
					span.ml-2.todo-item__title {{ title }}
				v-card-text.pl-4.todo-item__text
					.todo-item__description
						slot
					.todo-item__time-info.mt-2.pb-2
						p.todo-item__time-info(v-for="(text, index) in timeInfoText", :key="index") {{ text }}
		v-list.todo-item__actions-container
			v-list-tile.todo-item__action-btn(v-if="allowToComplete", title="Complete task", ripple, @click="completeTodo")
				v-icon(color="green") done
			v-list-tile.todo-item__action-btn(ripple, title="Remove task", @click="removeTodo")
				v-icon(color="red") delete
</template>

<script>
	import { mapState, mapGetters } from "vuex";

	export default {
		props: {
			created: Number,
			title: String,
			priority: Number,
			time: Number,
			singleSettings: {
				type: Object,
				required: false
			},
			intervalSettings: {
				type: Object,
				required: false
			}
		},

		data() {
			return {
				inProgress: false,
				updateInterval: null,
				allowToComplete: false,
				timeInfoText: []
			};
		},

		methods: {
			getAllowToComplete() {
				let now = new Date();

				if (this.withInterval) {
					if (!this.intervalSettings.doneTimes) {
						return now >= this.intervalSettings.lastFinished;
					} else {
						return now >= this.intervalSettings.lastFinished + this.intervalSettings.every;
					}
				} else {
					return now >= this.time && !this.singleSettings.done;
				}
			},

			getTimeInfoText() {
				let text = [];

				if (this.withInterval) {
					text.push(`Every ${this.everyInUnits} ${this.intervalSettings.everyUnits.replace("s", "(s)")}`);
				} else {
					text.push(`Scheduled for ${new Date(this.time).toLocaleString()}`)
				}

				if ( new Date() < this.time ) {
					let timeString = ( new Date(this.time) ).toLocaleString();

					if (this.withInterval) {
						text.push(`Since ${timeString}`);
					}

					return text;
				};

				// main info for interval mode
				if (this.withInterval) {
					text.push(`Done ${this.intervalSettings.doneTimes} time(s)`);

					if (this.intervalSettings.doneTimes) {
						text.push(`Last finished at ${new Date(this.intervalSettings.lastFinished).toLocaleString()}`);
					}

					if (this.allowToComplete) {
						text.push(`Complete the task`);
					} else {
						let nextTimeDate = new Date(this.intervalSettings.lastFinished + this.intervalSettings.every);

						text.push(`Next time at ${nextTimeDate.toLocaleString()}`);
					}
				} else {
					// and for single mode
				  if (this.singleSettings.done) {
				  	text.push(`Completed at ${new Date(this.singleSettings.doneTime).toLocaleString()}`);
				  } else {
				  	text.push("Complete the task");
					}
				}	

				return text;
			},

			update() {
				this.allowToComplete = this.getAllowToComplete();
				this.timeInfoText = this.getTimeInfoText();
			},

			completeTodo() {
				this.inProgress = true;

				let newData = null;

				if (this.withInterval) {
					newData = {
						intervalSettings: {
							doneTimes: this.intervalSettings.doneTimes + 1,
							every: this.intervalSettings.every,
							everyUnits: this.intervalSettings.everyUnits,
							lastFinished: ( new Date() ).valueOf()
						}
					};
				} else {
					newData = {
						singleSettings: {
							done: true,
							doneTime: ( new Date() ).valueOf()
						}
					};

					clearInterval(this.updateInterval);
				}

				this.docRef.update(newData)
					.then( () => {
						let editedIndex = this.currentTodos.findIndex( (todoObj) => {
							return todoObj.title === this.title;
						} );

						this.$store.commit("editTodo", {
							todoIndex: editedIndex,
							newData
						});
					} )
					.catch( (err) => {
						console.log(err);
					} )
					.finally( () => {
						this.inProgress = false;
					} );
			},
			
			removeTodo() {
				this.inProgress = true;

				this.docRef.delete()
					.then( () => {
						this.$store.dispatch("changeTodosCount", -1);

						/* 	
								process of removal from view list
								you can find in file called folders.js
						*/						
					} )
					.finally( () => {
						this.inProgress = false;
					} );
			}
		},

		computed: {
			...mapState({
				currentFolderDocRef: (state) => state.folders.currentFolderDocRef,
				currentFolderIndex: (state) => state.folders.currentFolderIndex,
				currentTodos: (state) => state.folders.currentTodos
			}),

			...mapGetters(["currentFolderObj"]),

			// document reference of this component object
			docRef() {
				return this.currentTodos.find( (obj) => {
					return obj.title === this.title;
				} ).docRef;
			},

			withInterval() {
				return this.intervalSettings !== undefined;
			},

			priorityColor() {
				if (this.priority >= 8) {
					return "#C92B36";
				} else if (this.priority >= 4 && this.priority < 8) {
					return "#5B649F";
				} else if (this.priority < 4) {
					return "#8790CB";
				}
			},
			
			everyInUnits() {
				if (this.withInterval) {
					let result = this.intervalSettings.every;

					switch (this.intervalSettings.everyUnits) {
						case "minutes":
							result /= 1000 * 60
						break;
						case "hours":
							result /= 1000 * 60 * 60;
						break;
						case "days":
							result /= 1000 * 60 * 60 * 24;
						break;		
					}

					return result;
				} else {
					return null;
				}
			}
		},

		updated() {
			this.update();
		},

		mounted() {
			this.update();

			if (this.withInterval || !this.singleSettings.done) {
				this.updateInterval = setInterval( () => {
					this.update();
				}, 1000 );
			}	
		}
	}
</script>

<style lang="scss">
	.todo-item {
		cursor: pointer;

		&__title {
			font-size: 18px;
			max-width: 90%;
			overflow: hidden;
			word-break: break-all;
		}

		&__actions-container {
			padding: 0;
		}

		&__action-btn {
			cursor: pointer;
			align-items: center;
		}

		&__text {
			padding-top: 0;
			padding-bottom: 0;
		}

		&__description {
			font-size: 15px;
			word-break: break-word;
		}

		&__time-info {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.7);

			& > p {
				margin-bottom: 4px;
			}
		}

		&:hover, &__action-btn:hover {
			background-color: rgba(131, 131, 131, 0.14);
		}

		@media screen and (max-width: 650px) {
			width: 100%;
		}

		@media screen and (min-width: 651px) {
			width: calc(100% / 12 * 6 - 16px);
		}

		@media screen and (min-width: 1259px) {
			width: calc(100% / 12 * 4 - 16px);
		}

		@media screen and (min-width: 1690px) {
			width: calc(100% / 12 * 3 - 16px);
		}

		@media screen and (min-width: 2161px) {
			width: calc(100% / 12 * 2.4 - 16px);
		}
	}
</style>