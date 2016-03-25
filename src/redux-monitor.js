function getValue(state, path) {
	for (let i = 0; i < path.length; i++) {
		state = state[path[i]];
		if ((state === undefined) || (state === null)) {
			return state;
		}
	}
	return state;
}

function reduxMonitor(store, objectPaths, callback) {
	objectPaths = Array.isArray(objectPaths) ? objectPaths : [objectPaths];
	const paths = objectPaths.map((path) => path.split('.'));
	const count = paths.length;
	const initialState = store.getState();
	const oldValues = paths.map((path) => getValue(initialState, path));
	const newValues = new Array(count);
	store.subscribe(() => {
		const state = store.getState();
		let changed;
		for (let i = 0; i < count; i++) {
			newValues[i] = getValue(state, paths[i]);
			changed = changed || (oldValues[i] !== newValues[i]);
		}
		if (changed) {
			for (let i = 0; i < count; i++) {
				oldValues[i] = newValues[i];
			}
			callback(state, oldValues);
		}
	});
}

export default reduxMonitor;