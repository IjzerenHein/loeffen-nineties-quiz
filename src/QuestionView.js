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
		fontWeight: 'bold',
		fontSize: 32,
		paddingLeft: 40,
		paddingRight: 30,
		paddingTop: 10,
		paddingBottom: 10,
		textAlign: 'left'
	},
	'text.tablet': {
		fontSize: 50
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
	constructor() {
		super();
		this.state = {
			tablet: false
		};
	}

	render() {
		const {style, question, ...props} = this.props;
		const buttons = Object.keys(question.options).map((optionId) => <Button
			key={optionId}
			style={styles.button}
			text={question.options[optionId]}
			onPress={() => this.props.dispatch(QuizActions.vote(question.id, optionId))}
			progress={(question.vote === optionId) ? 1 : 0}
			styleClass='vote'
		/>);
		return <View style={[style, styles.main]} onLayout={(e) => this._onMeasureView(e)} >
			<HeaderBar />
			<Text style={[styles.text, this.state.tablet ? styles['text.tablet'] : undefined]}>“{question.text}”</Text>
			<View style={styles.buttons}>{buttons}</View>
		</View>
	}

	_onMeasureView(event) {
		this.setState({
			tablet: (event.nativeEvent.layout.width > 1000)
		});
	}
}
export default connect()(QuestionView);
