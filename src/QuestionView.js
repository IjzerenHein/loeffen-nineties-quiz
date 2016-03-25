import React, {View, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import Button from './Button';
import Theme from './Theme';
import QuizActions from './quiz/actions';
import HeaderBar from './HeaderBar';

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
	buttons: {
		padding: 20,
		paddingBottom: 0
	},
	button: {
		marginBottom: 20
	}
});

class QuestionView extends React.Component {
	render() {
		const {style, question, ...props} = this.props;
		const buttons = Object.keys(question.options).map((optionId) => <Button
			key={optionId}
			style={styles.button}
			text={question.options[optionId]}
			onPress={() => this.props.dispatch(QuizActions.vote(question.id, optionId))}
			progress={(question.vote === optionId) ? 1 : 0}
		/>);
		return <View style={[style, styles.main]} >
			<HeaderBar />
			<Text style={styles.text}>{question.text}</Text>
			<View style={styles.buttons}>{buttons}</View>
		</View>
	}
}
export default connect()(QuestionView);
