import api from "@api";

export default {
	state: {
		isLogged: false,
		docRef: null,
		name: "",
		email: "",
		registered: null
	},

	mutations: {
		setUserLoggedState(state, value) {
			state.isLogged = value;
		},

		setUserDocRef(state, ref) {
			state.docRef = ref;
		},
		
		setUserName(state, name) {
			state.name = name;
		},

		setUserEmail(state, email) {
			state.email = email;
		},

		setUserRegistrationDate(state, time) {
			state.registered = ( new Date(time) ).toLocaleString();
		}
	},

	actions: {
		setUserData({ commit }, { name, email, regTime }) {
			commit("setUserName", name);
			commit("setUserEmail", email);
			commit( "setUserRegistrationDate", parseInt(regTime) );			
		},

		signIn({ commit, dispatch }, id) {
			let docRef = api.database.collection("users").doc(id);
			commit("setUserDocRef", docRef);
			dispatch("getFolders");

			// prefix for local storage props
			let prefix = "todo-app/user-data",
					name = localStorage.getItem(`${prefix}/name`),
					regTime = localStorage.getItem(`${prefix}/registered`);

			// if saved locally set it from local storage
			if (name && regTime) {
				dispatch("setUserData", {
					name, regTime
				});

				commit("setUserLoggedState", true);
				commit("setUserSectionProgressBar", false);
			}	else { // else get from database and set to local storage
				docRef.get()
					.then( (doc) => {
						let data = doc.data();

						if (data.name !== undefined && data.registered !== undefined && data.email !== undefined) {
							dispatch("setUserData", {
								name: data.name,
								email: data.email,
								regTime: data.registered
							});			
						}	
						
						commit("setUserLoggedState", true);
						commit("setUserSectionProgressBar", false);

						localStorage.setItem(`${prefix}/name`, data.name);
						localStorage.setItem(`${prefix}/registered`, data.registered);
					} );
			}
		}
	},

	getters: {
		userInitials(state) {
			return state.name.split(" ").map( (word) => word.charAt(0) ).slice(0, 2).join("");
		}
	}
};