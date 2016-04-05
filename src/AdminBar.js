import React, {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import Theme from './Theme';
import QuizActions from './quiz/actions';

const styles = StyleSheet.create({
	main: {
		backgroundColor: Theme.themeColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	logo: {
		marginLeft: 20,
		width: 110,
		resizeMode: 'contain'
	},
	title: {
		width: 300,
		resizeMode: 'contain'
	},
	buttons: {
		flexDirection: 'row',
		marginRight: 10
	},
	button: {
		paddingLeft: 10,
		paddingRight: 10
	},
	textButton: {
		color: Theme.lightColor,
		fontFamily: Theme.fontFamily,
		fontSize: 20
	}
});

const TextButton = (props) => {
	const {text, ...touchableProps} = props;
	return <TouchableOpacity style={styles.button} {...touchableProps}>
		<Text style={[styles.textButton, props.disabled ? {opacity: 0.5} : undefined]}>{text}</Text>
	</TouchableOpacity>;
};

const AdminBar = (props) => {
	const {style, quiz, dispatch,...viewProps} = props;
	const prevEnabled = (quiz.status === 'started') && quiz.activeQuestion && (quiz.questionIds.indexOf(quiz.activeQuestion.id) > 0);
	const nextEnabled = (quiz.status === 'started') && quiz.activeQuestion && (quiz.questionIds.indexOf(quiz.activeQuestion.id) < (quiz.questionIds.length - 1));
	const questionOpen = (quiz.status === 'started') && quiz.activeQuestion && (quiz.activeQuestion.status === 'open');
	return <View style={[style, styles.main]} {...viewProps}>
		<Image style={styles.logo} source={require('../assets/loeffen-wit.png')} />
		<Image style={styles.title} source={require('../assets/title.png')} />
		<View style={styles.buttons}>
			<TextButton
				text='vorige'
				disabled={!prevEnabled}
				onPress={() => dispatch(QuizActions.previousQuestion())}/>
			<TextButton
				text={questionOpen ? 'sluit stemronde' : 'heropen stemronde'}
				disabled={quiz.status === 'notStarted'}
				onPress={() => dispatch(questionOpen ? QuizActions.closeQuestion() : QuizActions.reopenQuestion())}
				/>
			<TextButton
				text='volgende'
				disabled={!nextEnabled}
				onPress={() => dispatch(QuizActions.nextQuestion())}/>
		</View>
	</View>;
};
export default connect(({quiz}) => {
	return {quiz};
})(AdminBar);