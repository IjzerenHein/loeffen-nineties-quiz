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
		color: Theme.lightColor,
		fontFamily: Theme.fontFamily,
		fontSize: 30
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
	return <View style={[style, styles.main]} {...viewProps}>
		<Image style={styles.logo} source={require('../assets/loeffen-wit.png')} />
		<Text style={styles.title}>NINETIES QUIZ</Text>
		<View style={styles.buttons}>
			<TextButton
				text='vorige'
				disabled={!prevEnabled}
				onPress={() => dispatch(QuizActions.previousQuestion())}/>
			<TextButton
				text='sluit stemronde'
				disabled={quiz.status === 'notStarted'}
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