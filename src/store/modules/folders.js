// CollectionRef - Firebase Collection Reference
// DocRef - Firebase Document Reference

export default {
	state: {
		isFoldersLoaded: false,
		list: [],
		foldersCollectionRef: null,
		currentFolderIndex: null,
		currentFolderDocRef: null,		
		todosOrder: null,
		orderTypes: [{
			type: "title",
			func: (itemA, itemB) => itemA.title.toUpperCase() > itemB.title.toUpperCase() ? 1 : -1
		}, {
			type: "created",
			func: (itemA, itemB) => itemA.created > itemB.created ? -1 : 1 
		}, {
			type: "priority",
			func: (itemA, itemB) => itemA.priority > itemB.priority ? -1 : 1
		}],
		isCurrentFolderLoaded: true,
		currentTodos: [{
			priority: 5,
			title: "TITLE",
			description: "DESCRIPTION",
			created: +(new Date())
		}, {
			priority: 9,
			title: "ABC",
			description: "HELLO",
			created: +(new Date()) - 1000
		}, {
			priority: 7,
			title: "DDD",
			description: "123123",
			created: +(new Date()) + 1000
		}]	
	},

	getters: {
		sortedTodos(state) {
			let currentOrderObj = state.orderTypes.find( (typeObj) => typeObj.type === state.todosOrder ),
					unsorted = [...state.currentTodos];

			if (currentOrderObj !== undefined) {
				return unsorted.sort(currentOrderObj.func);
			} else {
				return unsorted;
			}
		},

		currentTodosCollectionRef(state) {
			return state.currentFolderDocRef.collection("todos");
		}
	},

	mutations: {
		setFoldersLoadedState(state, value) {
			state.isFoldersLoaded = value;
		},
	
		setFoldersList(state, list) {
			state.list = list;
		},

		addFolder(state, { name, docRef, created, todosCount }) {
			let createdDate = created ? new Date(created) : null;

			state.list.push({
				name,
				docRef,
				created: createdDate,
				todosCount 
			});
		},
	
		deleteFolder(state, folderIndex) {
			state.list.splice(folderIndex, 1);
		},
	
		setCurrentFolderIndex(state, folderIndex) {
			state.currentFolderIndex = folderIndex;
		},
	
		setFoldersCollectionRef(state, ref) {
			state.foldersCollectionRef = ref;
		},
	
		setCurrentFolderDocRef(state, ref) {
			state.currentFolderDocRef = ref;
		},
	
		setFolderCreated(state, { folderIndex, value }) {
			state.list[folderIndex].created = new Date(value);
		},
	
		setFolderTodosCount(state, { folderIndex, value }) {
			state.list[folderIndex].todosCount = value;
		},
	
		setTodosOrder(state, orderBy) {
			state.todosOrder = orderBy;

			localStorage.setItem("todo-app/user-data/order-by", orderBy);
		},

		setCurrentTodos(state, list) {
			state.currentTodos = list;
		},

		// loading state of todos in currentFolder
		setCurrentFolderLoadedState(state, value) {
			state.isCurrentFolderLoaded = value;
		}
	},

	actions: {
		getFolders({ rootState, commit, dispatch }) {
			commit("setFoldersListSectionProgressBar", true);
	
			let foldersCollectionRef = rootState.user.docRef.collection("folders");
			commit("setFoldersCollectionRef", foldersCollectionRef);

			dispatch("setDatabaseListener");
	
			foldersCollectionRef.get()
				.then( (collection) => {
					let foldersArray = collection.docs.map( (doc) => {
						return {
							name: doc.ref.id,
							docRef: doc.ref,
							created: null,
							todosCount: null
						};
					} );
	
					commit("setFoldersList", foldersArray);
	
					commit("setFoldersLoadedState", true);
					commit("setFoldersListSectionProgressBar", false);
				} );
		},
	
		setDatabaseListener({ state, commit, dispatch }) {
			state.foldersCollectionRef.onSnapshot( (snapshot) => {
				let fromServer = !snapshot.metadata.hasPendingWrites;

				if (fromServer) {
					snapshot.docChanges()
						.forEach( (change) => {
							if (change.type === "removed") {
								let removedIndex = state.list.findIndex( (folderObj) => {
									return folderObj.name === change.doc.id;
								} );

								commit("deleteFolder", removedIndex);

								if (state.currentFolderIndex === removedIndex) {
									dispatch("resetCurrentFolder");
								}
							} else if (change.type === "added" && state.isFoldersLoaded) {
								commit("addFolder", {
									name: change.doc.ref.id,
									docRef: change.doc.ref,
									created: null,
									todosCount: null
								});
							}
						} );
				}
			} );
		},

		resetCurrentFolder({ commit }) {
			commit("setCurrentFolderIndex", null);
			commit("setCurrentFolderDocRef", null);		
		},
	
		switchCurrentFolder({ state, commit }, folderIndex) {
			commit("setCurrentFolderIndex", folderIndex);
			
			let currentFolderDocRef = state.list[folderIndex].docRef;
			commit("setCurrentFolderDocRef", currentFolderDocRef);
	
			let folderTodosCollectionRef = currentFolderDocRef.collection("todos");
			/*folderTodosCollectionRef.get()
				.then( (collection) => {
					// ...
				} );*/
		}
	}
};