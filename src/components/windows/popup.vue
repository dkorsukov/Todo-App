<template lang="pug">
	v-dialog(v-model="visible", :persistent="true", :maxWidth="width")
		v-card
			v-card-title
				slot(name="title")
			v-divider
			v-alert(:type="messageType", :value="showError") {{ messageText }}
			v-container(fluid, pa-1, grid-list-md)
				v-card-text
					v-layout(row, justify-center, align-center)
						v-flex(:class="`md${contentCols}`")
							slot(name="content")
					v-layout(row, justify-end)
						v-btn(flat, :disabled="inProgress", @click="close") Close
						v-btn(color="primary", :disabled="inProgress", :loading="inProgress", @click="$emit('confirm')", v-if="confirmBtn") Confirm	
</template>

<script>
	export default {
		// in progress - state for disable buttons and forms
		props: {
			name: String,
			inProgress: Boolean,
			width: {
				type: Number,
				required: false,
				default: 700
			},
			contentCols: {
				type: Number,
				required: false,
				default: 11
			},
			confirmBtn: {
				type: Boolean,
				required: false,
				default: true
			}
		},

		data() {
			return {
				messageText: "",
				messageType: "error"
			};
		},

		methods: {
			close() {
				this.$emit("close");

				this.messageText = "";
				this.visible = false;
			},

			open() {
				this.visible = true;
			},

			showMessage(type, text) {
				this.messageType = type;
				this.messageText = text;
			}
		},

		computed: {
			visible: {
				get() {
					return this.$store.state.windows[this.name];
				},

				set(value) {
					let modifiedName = this.name.charAt(0).toUpperCase() + this.name.substr(1);

					this.$store.commit(`set${modifiedName}Popup`, false);
				}
			},

			showError() {
				return !!( this.messageText.trim() );
			}
		}
	}
</script>

<style lang="sass">

</style>