import C from './constants';

export default (state = {}, action) => {
	switch (action.type) {
		case C.LOGGING_IN:
			return {
                name: 'guest',
                status: 'loggingIn',
                uid: null,
                admin: false
            };
        case C.LOGIN:
			return {
                name: action.name,
                status: 'loggedIn',
                uid: action.uid,
                admin: action.admin
            };
        case C.LOGOUT:
			return {
                name: 'guest',
                status: 'loggedOut',
                uid: null,
                admin: false
            };
        case C.SIGNING_UP:
            return {
                name: action.name,
                status: 'signingUp',
                uid: null,
                admin: false
            };
		default:
			return state;
	}
}
