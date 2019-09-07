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
			type: "time",
			func: (itemA, itemB) => itemA.time < itemB.time ? -1 : 1
		}, {
			type: "priority",
			func: (itemA, itemB) => itemA.priority > itemB.priority ? -1 : 1
		}],
		isCurrentFolderLoaded: false,
		currentTodos: [],
		todosCollectionUnsubscribe: null,
		todosCache: {}
	},

	getters: {
		currentFolderObj(state) {
			return state.list[state.currentFolderIndex];
		},

		sortedTodos(state) {
			let currentOrderObj = state.orderTypes.find( (typeObj) => typeObj.type === state.todosOrder ),
					unsorted = [...state.currentTodos];

			if (currentOrderObj !== undefined) {
				return unsorted.sort(currentOrderObj.func);
			} else {
				return unsorted;
			}
		},

		currentFolderName(state) {
			return state.currentFolderDocRef.id;
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

			// add empty list for each folder (cache)
			list.forEach( (folderObj) => {
				state.todosCache[folderObj.name] = [];
			} );
		},

		addFolder(state, { name, docRef, created, todosCount }) {
			let createdDate = created ? new Date(created) : null;

			state.list.push({
				name,
				docRef,
				created: createdDate,
				todosCount 
			});

			state.todosCache[name] = [];
		},
	
		deleteFolder(state, folderIndex) {
			// remove folder cache
			delete state.todosCache[ state.list[folderIndex].docRef.id ];

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
	
		setFolderCache(state, { folderName, value }) {
			state.todosCache[folderName] = value;
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

		addTodo(state, todoObj) {
			// add to current view list
			state.currentTodos.push(todoObj);

			// add to cache
			state.todosCache[state.currentFolderDocRef.id].push(todoObj);
		},

		removeTodo(state, todoIndex) {
			// remove from current view list
			state.currentTodos.splice(todoIndex, 1);

			// remove from cache
			state.todosCache[state.currentFolderDocRef.id].splice(todoIndex, 1);

			// change todosCount field in folder object
		},

		editTodo(state, { todoIndex, newData }) {
			let forEdit = state.currentTodos[todoIndex],
					newObj = {
						...forEdit,
						...newData
					};

			// use splice to say Vue.js update getter
			state.currentTodos.splice(todoIndex, 1, newObj);

			state.todosCache[state.currentFolderDocRef.id][todoIndex] = newObj;
		},

		// loading state of todos in currentFolder
		setCurrentFolderLoadedState(state, value) {
			state.isCurrentFolderLoaded = value;
		},

		setTodosCollectionListenerUnsubscribe(state, func) {
			state.todosCollectionUnsubscribe = func;
		}
	},

	actions: {
		getFolders({ rootState, commit, dispatch }) {
			commit("setFoldersListSectionProgressBar", true);
	
			let foldersCollectionRef = rootState.user.docRef.collection("folders");
			commit("setFoldersCollectionRef", foldersCollectionRef);

			dispatch("setFoldersCollectionListener");
	
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
	
		changeTodosCount({ state, commit, getters }, value) {
			if (getters.currentFolderObj.todosCount !== null) {
				commit("setFolderTodosCount", {
					folderIndex: state.currentFolderIndex,
					value: getters.currentFolderObj.todosCount + value 
				});
			}	
		},

		setFoldersCollectionListener({ state, commit, dispatch }) {
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

								// if removed folder was selected
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

		setTodosCollectionListener({ state, commit, dispatch, getters }) {
			let unsubscribe = getters.currentTodosCollectionRef
				.onSnapshot( (snapshot) => {
					let fromServer = !snapshot.metadata.hasPendingWrites;

					if (fromServer) {
						dispatch("resetCurrentFolderInfo");

						snapshot.docChanges()
							.forEach( (change) => {
								switch (change.type) {
									case "removed":
										let changedDocObjIndex = state.currentTodos.findIndex( (todoObj) => {
											return todoObj.title === change.doc.ref.id;
										} );

										commit("removeTodo", changedDocObjIndex);
									break;

									case "modified":
										change.doc.ref.get()
											.then( (doc) => {
												let data = doc.data();

												let editedIndex = state.currentTodos.findIndex( (todoObj) => {
													return todoObj.title === data.title;
												} );

												commit("editTodo", {
													todoIndex: editedIndex,
													newData: data
												});
											} );
									break;

									case "added":
										let folderInCache = state.todosCache[getters.currentFolderName];

										let searchInSaved = folderInCache.find( (todoObj) => {
											return change.doc.ref.id === todoObj.title;
										} );

										// If not found in current folder cache
										if (searchInSaved === undefined) {
											commit("setMainSectionProgressBar", true);
											commit("setCurrentFolderLoadedState", false);

											change.doc.ref.get()
												.then( (doc) => {
													let data = doc.data();

													commit("addTodo", {
														docRef: change.doc.ref,
														...data
													});
												} )
												.finally( () => {
													commit("setMainSectionProgressBar", false);
													commit("setCurrentFolderLoadedState", true);
												} );
										}
									break;
								}
							} );
					}
				} );

			commit("setTodosCollectionListenerUnsubscribe", unsubscribe);
		},

		unsetTodosCollectionListener({ state }) {
			if (state.todosCollectionUnsubscribe !== null) {
				state.todosCollectionUnsubscribe();
			}
		},

		resetCurrentFolderInfo({ state, commit }) {
			commit("setFolderTodosCount", {
				folderIndex: state.currentFolderIndex,
				value: null
			});			
		},

		getFolderInfo({ state, commit }, folderIndex) {
			let requiredObj = state.list[folderIndex];

			if (requiredObj.created === null) {
				requiredObj.docRef.get()
					.then( (doc) => {
						let data = doc.data();

						commit("setFolderCreated", {
							folderIndex,
							value: data.created
						});
					} );
			}

			requiredObj.docRef.collection("todos").get()
				.then( (collection) => {
					commit("setFolderTodosCount", {
						folderIndex,
						value: collection.docs.length
					});
				} );
		},

		resetCurrentFolder({ commit }) {
			commit("setCurrentFolderIndex", null);
			commit("setCurrentFolderDocRef", null);
			commit("setCurrentTodos", []);
			commit("setCurrentFolderLoadedState", false);
		},

		switchCurrentFolder({ state, commit, dispatch }, newFolderIndex) {
			dispatch("resetCurrentFolder");

			commit("setCurrentFolderIndex", newFolderIndex);
			
			let newFolderDocRef = state.list[newFolderIndex].docRef;
			commit("setCurrentFolderDocRef", newFolderDocRef);

			dispatch("unsetTodosCollectionListener");

			// Set saved from cache
			if (newFolderDocRef.id in state.todosCache) {
				let fromCache = state.todosCache[newFolderDocRef.id].slice();
				commit("setCurrentTodos", fromCache);

				commit("setCurrentFolderLoadedState", true);
			};

			dispatch("setTodosCollectionListener");
		}
	}
};