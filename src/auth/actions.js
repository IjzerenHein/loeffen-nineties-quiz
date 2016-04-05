import C from './constants';
import {AsyncStorage} from 'react-native';
import Firebase from 'firebase';
import FirebaseSmartRef from '../firebase-smart-ref';

//AsyncStorage.clear();

const ref = new Firebase('https://loeffen-reunie-quiz.firebaseio.com');

export default class {
	static init(store) {
		return new Promise((resolve) => {
			const dispatch = store.dispatch;
			let uid;
			const userRef = new FirebaseSmartRef();
			userRef.on('value', (snapshot) => {
				const val = snapshot.val();
				dispatch({
					type: C.LOGIN,
					uid: uid,
					name: val.name,
					admin: val.admin
				});
				userRef.ref.child('online').set(true);
				resolve(true);
			});
			const waitForAuth = () => {
				ref.onAuth((authData) => {
					if (!authData) {
						uid = undefined;
						userRef.setRef(undefined);
						return dispatch({type: C.LOGOUT});
					}
					uid = authData.uid;
					userRef.setRef(ref.child('users').child(authData.uid));

					const connectedRef = ref.child('.info/connected');
					const onlineRef = userRef.ref.child('online');
					connectedRef.on('value', (snapshot) => {
						if (snapshot.val()) {
							onlineRef.onDisconnect().set(false);
							onlineRef.set(true);
						}
					});
				});
			};
			dispatch({type: C.LOGGING_IN});
			AsyncStorage.getItem('authToken', (error, result) => {
				return result ? ref.authWithCustomToken(result, waitForAuth) : waitForAuth();
				//waitForAuth();
			});
		});
	}

	static logout() {
		// TODO MAYBE?
	}

	static signup(name) {
		return function(dispatch) {
			dispatch({type: C.SIGNING_UP, username: name});
			ref.authAnonymously((error, authData) => {
				if (error) {
					dispatch({type: C.LOGOUT});
				} else {
					AsyncStorage.setItem('authToken', authData.token);
					ref.child('users').child(authData.uid).set({
						name: name
					});
				}
			});
		};
	}
}