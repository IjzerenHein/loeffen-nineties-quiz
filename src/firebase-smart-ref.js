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
}