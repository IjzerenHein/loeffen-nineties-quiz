import React, {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
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
		alignItems: 'center',
		flexDirection: 'row',
		marginRight: 10
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
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
	const {text, icon, iconAlign, ...touchableProps} = props;
	return <TouchableOpacity {...touchableProps}>
		<View style={[styles.button, props.disabled ? {opacity: 0.5} : undefined]}>
			{icon && (iconAlign === 'left') ? <Icon name={icon} size={30} color={Theme.lightColor} style={{marginRight: 8}}/> : undefined}
			<Text style={styles.textButton}>{text}</Text>
			{icon && (iconAlign === 'right') ? <Icon name={icon} size={30} color={Theme.lightColor} style={{marginLeft: 8}}/> : undefined}
		</View>
	</TouchableOpacity>;
};

const AdminBar = (props) => {
	const {style, quiz, dispatch,...viewProps} = props;
	const question = quiz.activeQuestion;
	const prevEnabled = (quiz.status !== 'notStarted') && question && (quiz.questionIds.indexOf(quiz.activeQuestion.id) > 0);
	const nextEnabled = (quiz.status === 'started') && question && (question.status === 'closed') && (quiz.questionIds.indexOf(quiz.activeQuestion.id) < (quiz.questionIds.length - 1));
	const resultsEnabled = (quiz.status === 'started') && question && (question.status === 'closed') && (quiz.questionIds.indexOf(quiz.activeQuestion.id) === (quiz.questionIds.length - 1));
	const questionOpen = (quiz.status === 'started') && question && (quiz.activeQuestion.status !== 'closed');
	return <View style={[style, styles.main]} {...viewProps}>
		<Image style={styles.logo} source={require('../assets/loeffen-wit.png')} />
		<Image style={styles.title} source={require('../assets/title.png')} />
		<View style={styles.buttons}>
			<TextButton
				text='vorige'
				disabled={!prevEnabled}
				icon='chevron-left'
				iconAlign='left'
				onPress={() => dispatch(quiz.status === 'started' ? QuizActions.previousQuestion() : QuizActions.start())}/>
			<TextButton
				text={questionOpen ? 'sluit stemronde' : 'heropen stemronde'}
				disabled={quiz.status !== 'started'}
				onPress={() => dispatch(questionOpen ? QuizActions.closeQuestion() : QuizActions.reopenQuestion())}
				/>
			{resultsEnabled ? <TextButton
				text='naar de resultaten'
				icon='chevron-right'
				iconAlign='right'
				onPress={() => dispatch(QuizActions.finish())}/> : 
			<TextButton
				text='volgende'
				disabled={!nextEnabled}
				icon='chevron-right'
				iconAlign='right'
				onPress={() => dispatch(QuizActions.nextQuestion())}/>}
		</View>
	</View>;
};
export default connect(({quiz}) => {
	return {quiz};
})(AdminBar);