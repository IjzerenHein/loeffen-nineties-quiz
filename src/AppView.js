import React, {View, StyleSheet, Navigator} from 'react-native';
import {Provider} from 'react-redux';
import monitor from './redux-monitor';
import RootView from './RootView';
import QuestionView from './QuestionView';
import AdminView from './AdminView';
import ResultsView from './ResultsView';
import HeaderBar from './HeaderBar';
import store from './store';
import AuthActions from './auth/actions';
import QuizActions from './quiz/actions';
import Theme from './Theme';

const styles = StyleSheet.create({
	main: {
		backgroundColor: Theme.lightColor,
		flex: 1,
		flexDirection: 'column'
	},
	results: {
		paddingLeft: 20,
		paddingRight: 20,
		flex: 1
	}
});

class AppView extends React.Component {
	componentDidMount() {
		AuthActions.init(store);
		QuizActions.init(store);
		monitor(store, ['auth.status', 'auth.admin', 'auth.name', 'auth.quizStatus', 'quiz.status', 'quiz.activeQuestion'], (state) => this._updateRoute(state));
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
		} else if (route.type === 'results') {
			return <View style={styles.main}>
				<HeaderBar />
				<View style={styles.results}><ResultsView style={{marginTop: 20}} /></View>
			</View>;
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
		else if ((auth.status === 'loggedIn') && ((quiz.status === 'started') || (auth.adminMonitor) || ((quiz.status === 'finished') && !auth.quizStatus)) && quiz.activeQuestion) {
			if (this.navigator && (!this.route || (this.route.type !== 'question') || (this.route.question.id !== quiz.activeQuestion.id))) {
				this._navigateTo('push', {type: 'question', question: quiz.activeQuestion});
			}
			else {
				this.forceUpdate();
			}
		}
		else if ((auth.status === 'loggedIn') && (quiz.status === 'finished') && ((auth.quizStatus === 'interactive') || (auth.quizStatus === 'completedAfterwards'))) {
			if (this.navigator && (!this.route || (this.route.type !== 'results'))) {
				this._navigateTo('push', {type: 'results'});
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
