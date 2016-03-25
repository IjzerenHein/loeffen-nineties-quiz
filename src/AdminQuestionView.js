import React, {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
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
		lineHeight: 48,
		padding: 30,
		textAlign: 'left'
	},
	answer: {
		color: Theme.themeColor,
		fontFamily: Theme.fontFamily,
		fontSize: 42,
		lineHeight: 48,
		padding: 30,
		textAlign: 'left'
	},
	showAnswer: {
		color: Theme.themeColor,
		fontFamily: Theme.fontFamily,
		fontSize: 30
	},
	button: {
		paddingBottom: 20
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	showResults: {
		color: Theme.themeColor,
		fontFamily: Theme.fontFamily,
		fontSize: 20
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
		voteKeys.forEach((key) => count += ((votes[key] === optionId) ? 1 : 0));
		return <Button
			key={optionId}
			style={styles.button}
			text={question.options[optionId]}
			progress={voteKeys.length ? (count / voteKeys.length) : 0}
		/>;
	});

	let answer;
	if (question.answer) {
		answer = question.answerVisible ? 
		<Text style={styles.answer}>Antwoord: <Text style={{fontWeight: 'bold'}}>{question.options[question.answer]}</Text></Text> :
		<TouchableOpacity onPress={() => dispatch(QuizActions.showAnswer(!question.answerVisible))}>
			<Text style={styles.showAnswer}>
				{question.answerVisible ? 'Verberg' : 'Toon'} antwoord
			</Text>
		</TouchableOpacity>;
	}

	return <View style={[style, styles.main]} >
		<Text style={styles.text}>{question.text}</Text>
		{answer}
		<View style={styles.buttons}>
			{buttons}
			<View style={styles.footer}>
				<TouchableOpacity onPress={() => dispatch(QuizActions.showResults(!question.resultsVisible))}>
					<Text style={styles.showResults}>
						{question.resultsVisible ? 'Verberg' : 'Toon'} alle resultaten
					</Text>
				</TouchableOpacity>
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
