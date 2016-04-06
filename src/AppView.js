import React, {Navigator} from 'react-native';
import {Provider} from 'react-redux';
import monitor from './redux-monitor';
import RootView from './RootView';
import QuestionView from './QuestionView';
import AdminView from './AdminView';
import store from './store';
import AuthActions from './auth/actions';
import QuizActions from './quiz/actions';

class AppView extends React.Component {
	componentDidMount() {
		AuthActions.init(store);
		QuizActions.init(store);
		monitor(store, ['auth.status', 'auth.admin', 'quiz.activeQuestion'], (state) => this._updateRoute(state));
	}

	render() {
		return <Navigator
			initialRoute={{type: 'root'}}
			renderScene={(route, nav) => this.renderScene(route, nav)} />
	}

	renderScene(route, navigator) {
		this.navigator = navigator;

		if (route.type === 'root') {
			return <RootView />
		} else if (route.type === 'question') {
			const activeQuestion = store.getState().quiz.activeQuestion;
			return <QuestionView question={(activeQuestion && (activeQuestion.id === route.question.id)) ? activeQuestion : route.question}/>
		} else if (route.type === 'admin') {
			return <AdminView />
		}
	}

	_navigateTo(type, route) {
		this.route = route;
		switch (type) {
			case 'reset': this.navigator.resetTo(route); break;
			case 'push': this.navigator.push(route); break;
		}
	}

	_updateRoute({auth, quiz}) {
		if (auth.admin) {
			if (!this.route || (this.route.type !== 'admin')) {
				this._navigateTo('reset', {type: 'admin'});
			}
		}
		else if ((auth.status === 'loggedIn') && (quiz.status === 'started') && quiz.activeQuestion) {
			if (this.navigator && (!this.route || (this.route.type !== 'question') || (this.route.question.id !== quiz.activeQuestion.id))) {
				this._navigateTo('push', {type: 'question', question: quiz.activeQuestion});
			}
			else {
				this.forceUpdate();
			}
		}
		else if (!this.route || (this.route.type !== 'root')) {
			this._navigateTo('reset', {type: 'root'});
		}
	}
}

const App = () => (
	<Provider store={store}>
		<AppView />
	</Provider>
);
export default App;
