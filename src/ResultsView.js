import React, {Text, StyleSheet, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import Button from './Button';
import Theme from './Theme';

const styles = StyleSheet.create({
	main: {
		backgroundColor: Theme.lightColor,
		flex: 1,
		flexDirection: 'column'
	},
	title: {
		color: Theme.themeColor,
		fontFamily: Theme.fontFamily,
		fontWeight: 'bold',
		fontSize: Theme.fontSize,
		marginLeft: 20,
		marginBottom: 20,
		textAlign: 'left'
	},
	buttons: {
		paddingLeft: 20,
		paddingRight: 20
	},
	button: {
		marginBottom: 20
	}
});

class ResultsView extends React.Component {
	render() {
		const {style, quiz, ...props} = this.props;
		const buttons = quiz.results.map((result, index) => <Button
			key={result.uid}
			style={styles.button}
			text={(index + 1) + '. ' + result.name + ' (' + result.totalAnsweredCorrect + ')'}
			progress={result.totalAnsweredCorrect / result.totalQuestionsWithAnswer}
			styleClass='vote'
		/>);
		return <ScrollView style={[style, styles.main]} >
			<Text style={styles.title}>Standenlijst:</Text>
			{buttons}
		</ScrollView>
	}
}
export default connect(({quiz}) => {
	return {quiz};
})(ResultsView);
