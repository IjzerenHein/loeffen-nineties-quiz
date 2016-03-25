import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import auth from './auth/reducer';
import quiz from './quiz/reducer'

const questions = (state = [], action) => {
	switch (action) {
		default:
			return state;
	}
	return state
}

export default createStore(combineReducers({
	auth,
	quiz,
	questions
}), applyMiddleware(thunk));
