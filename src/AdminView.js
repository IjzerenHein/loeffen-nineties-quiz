import React, {View, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import Theme from './Theme';
import AdminBar from './AdminBar';
import Button from './Button';
import QuizActions from './quiz/actions';
import AdminQuestionView from './AdminQuestionView';

const styles = StyleSheet.create({
	main: {
		flexDirection: 'column',
		flex: 1
	},
	content: {
		flex: 1,
		padding: 40
	},
	bar: {
		height: 100
	},
	startButton: {
		
	},
	startContent: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	startText: {
		fontFamily: Theme.fontFamily,
		fontSize: 46,
		textAlign: 'center'
	}
});

let StartView = (props) => {
	const {style, quiz, dispatch, ...viewProps} = props;
	return <View style={style} {...viewProps}>
		<View style={styles.startContent}>
			<Text style={styles.startText}>Aantal deelnemers: {quiz.onlineUserCount}</Text>
		</View>
		<Button
			style={styles.startButton}
			text='Start de Quiz'
			progress={0}
			onPress={() => props.dispatch(QuizActions.start())} />
	</View>
};
StartView = connect(({quiz}) => {return {quiz}})(StartView);

class AdminView extends React.Component {
	render() {
		const {style, quiz, ...props} = this.props;
		let content;
		//console.log('status, ', quiz);
		if ((quiz.status === 'started') && quiz.activeQuestion) {
			content = <AdminQuestionView style={styles.content} />;
		}
		else {
			content = <StartView style={styles.content} />;
		}
		return <View style={[style, styles.main]} {...props}>
			{content}
			<AdminBar style={styles.bar} />
		</View>;
	}
}
export default connect(({quiz}) => {
	return {quiz}
})(AdminView);