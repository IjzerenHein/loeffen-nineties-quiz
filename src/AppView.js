import React, {Navigator} from 'react-native';
import {Provider} from 'react-redux';
import RootView from './RootView';
import QuestionView from './QuestionView';
import AdminView from './AdminView';
import store from './store';
import AuthActions from './auth/actions';
import QuizActions from './quiz/actions';

class AppView extends React.Component {
	componentDidMount() {
		AuthActions.init(store);/*.then(() => {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		});*/
		QuizActions.init(store);
		store.subscribe(() => this._updateRoute(store.getState()));
	}

	render() {
		return <Navigator
			initialRoute={{type: 'root'}}
			renderScene={(route, nav) => this.renderScene(route, nav)} />
	}

	renderScene(route, navigator) {
		this.navigator = navigator;
		this.route = route;

		if (route.type === 'root') {
			return <RootView />
		} else if (route.type === 'question') {
			return <QuestionView question={store.getState().quiz.activeQuestion}/>
		} else if (route.type === 'admin') {
			return <AdminView />
		}
	}

	_updateRoute({auth, quiz}) {
		if (auth.admin) {
			if (!this.route || (this.route.type !== 'admin')) {
				this.navigator.resetTo({type: 'admin'});
			}
		}
		else if ((auth.status === 'loggedIn') && (quiz.status === 'started') && quiz.activeQuestion) {
			if (this.navigator && (!this.route || (this.route.type !== 'question') || (this.route.questionId !== quiz.activeQuestion.id))) {
				this.navigator.push({type: 'question', questionId: quiz.activeQuestion.id});
			}
			else {
				this.forceUpdate();
			}
		}
		else if (!this.route || (this.route.type !== 'root')) {
			this.navigator.resetTo({type: 'root'});
		}
	}
}

const App = () => (
	<Provider store={store}>
		<AppView />
	</Provider>
);
export default App;
