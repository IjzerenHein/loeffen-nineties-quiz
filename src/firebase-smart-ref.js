export default class FirebaseSmartRef {
	constructor(ref) {
		this.ref = ref;
		this.eventListeners = [];
	}

	getRef() {
		return this.ref;
	}

	setRef(value) {
		if (this.ref === value) {
			return;
		}
		if (this.ref) {
			for (let i = 0; i < this.eventListeners.length; i++) {
				const e = this.eventListeners[i];
				this.ref.off(e.eventType, e.callback, e.context);
			}
		}
		this.ref = value;
		if (this.ref) {
			for (let i = 0; i < this.eventListeners.length; i++) {
				const e = this.eventListeners[i];
				this.ref.on(e.eventType, e.callback, e.cancelCallback, e.context);
			}	
		}
	}

	on(eventType, callback, cancelCallback, context) {
		this.eventListeners.push({
			eventType,
			callback,
			cancelCallback,
			context
		});
		if (this.ref) {
			this.ref.on(eventType, callback, cancelCallback, context);
		}
		return callback;
	}

	off(eventType, callback, context) {
		for (let i = 0; i < this.eventListeners.length; i++) {
			const e = this.eventListeners[i];
			if ((e.eventType === eventType) && (e.callback === callback) && (e.context === context)) {
				this.eventListeners.splice(i, 1);
				break;
			}
		}
		if (this.ref) {
			this.ref.off(eventType, callback, context);
		}	
	}

	onValue(callback) {
		return new Promise((resolve) => {
			if (this.onValueCallback) {
				this.onValueResolve(undefined);
				this.off('value', this.onValueCallback);
				this.onValueCallback = undefined;
				this.onValueResolve = undefined;
			}
			this.onValueResolve = resolve;
			this.onValueCallback = this.on('value', (snapshot) => {
				resolve(snapshot);
				return callback ? callback(snapshot) : undefined;
			});
		});
	}
}