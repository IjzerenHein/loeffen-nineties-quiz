import React, {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import tinycolor from 'tinycolor2';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from './Button';
import Theme from './Theme';
import QuizActions from './quiz/actions';

const styles = StyleSheet.create({
	main: {
		backgroundColor: Theme.lightColor,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	text: {
		color: Theme.themeColor,
		fontFamily: Theme.fontFamily,
		fontSize: 42,
		padding: 20,
		textAlign: 'left'
	},
	answer: {
		color: tinycolor(Theme.themeColor).setAlpha(0.5).toString(),
		fontFamily: Theme.fontFamily,
		fontSize: 42,
		lineHeight: 48,
		padding: 20,
		textAlign: 'left'
	},
	showAnswer: {
		alignItems: 'center',
		flexDirection: 'row',
		marginLeft: 20,
		opacity: 0.7
	},
	showAnswerText: {
		color: Theme.themeColor,
		fontFamily: Theme.fontFamily,
		fontSize: 24,
		marginRight: 7
	},
	button: {
		paddingBottom: 20
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	showResults: {
		alignItems: 'center',
		flexDirection: 'row',
		marginLeft: 20,
		opacity: 0.7
	},
	showResultsText: {
		color: Theme.themeColor,
		fontFamily: Theme.fontFamily,
		fontSize: 20,
		marginRight: 7
	},
	voteCount: {
		color: Theme.themeColor,
		fontFamily: Theme.fontFamily,
		fontSize: 20,
		opacity: 0.7
	}
});

const AdminQuestionView = (props) => {
	const {style, dispatch, quiz} = props;
	const question = quiz.activeQuestion;
	const votes = question.votes || {};
	const voteKeys = Object.keys(votes);
	const buttons = Object.keys(question.options).map((optionId) => {
		let count = 0;
		if (question.resultsVisible) {
			voteKeys.forEach((key) => count += ((votes[key] === optionId) ? 1 : 0));
		}
		return <Button
			key={optionId}
			style={styles.button}
			text={question.options[optionId]}
			progress={voteKeys.length ? (count / voteKeys.length) : 0}
			styleClass='vote'
		/>;
	});

	let answer;
	if (question.answer && (question.status === 'closed')) {
		answer = question.answerVisible ? 
		<Text style={styles.answer}>Antwoord: <Text style={{color: Theme.themeColor}}>{question.options[question.answer]}</Text></Text> :
		<TouchableOpacity onPress={() => dispatch(QuizActions.showAnswer(!question.answerVisible))}>
			<View style={styles.showAnswer}>
				<Text style={styles.showAnswerText}>
					{question.answerVisible ? 'Verberg' : 'Toon'} antwoord
				</Text>
				<Icon name='android-arrow-dropright-circle' size={30} color={Theme.themeColor}/>
			</View>
		</TouchableOpacity>;
	}
	let showResults = (question.status === 'closed') ?
		<TouchableOpacity onPress={() => dispatch(QuizActions.showResults(!question.resultsVisible))}>
			<View style={styles.showResults}>
				<Text style={styles.showResultsText}>
					{question.resultsVisible ? 'Verberg' : 'Toon'} alle resultaten
				</Text>
				<Icon
					name={question.resultsVisible ? 'android-arrow-dropleft-circle' : 'android-arrow-dropright-circle'}
					size={24} color={Theme.themeColor}/>
			</View>
		</TouchableOpacity> : <View />;

	return <View style={[style, styles.main]} >
		<Text style={styles.text}>“{question.text}”</Text>
		{answer}
		<View style={styles.buttons}>
			{buttons}
			<View style={styles.footer}>
				{showResults}
				<Text style={styles.voteCount}>
					Aantal stemmen: {voteKeys.length}/{Math.max(quiz.onlineUserCount, voteKeys.length)}
				</Text>
			</View>
		</View>
	</View>;
};
export default connect(({quiz}) => {
	return {quiz};
})(AdminQuestionView);
