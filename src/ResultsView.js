import React, {View, Text, StyleSheet, ScrollView} from 'react-native';
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
		fontSize: 28,
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
		/*const results = [
			{uid: '98', name: '1. Henkie', score: 8},
			{uid: '985', name: '2. Sjors', score: 8},
			{uid: '981', name: '3. Henkie', score: 7},
			{uid: '9852', name: '4. Sjors', score: 6},
			{uid: '9811', name: '5. Henkie', score: 5},
			{uid: '9852111', name: '6. Sjors', score: 5},
			{uid: '983', name: '7. Henkie', score: 5},
			{uid: '9855', name: '8. Sjors', score: 5},
			{uid: '984', name: '9. Henkie', score: 4},
			{uid: '9854', name: '10. Sjors', score: 4},
			{uid: '9855000', name: '11. Henkie', score: 4},
			{uid: '98567', name: '12. Sjors', score: 3},
			{uid: '9800', name: '13. Henkie', score: 3},
			{uid: '9850', name: '14. Sjors', score: 3},
			{uid: '98000', name: '15. Henkie', score: 3},
			{uid: '985000', name: '16. Sjors', score: 3},
			{uid: '9856', name: '17. Henkie', score: 2},
			{uid: '98556', name: '18. Sjors', score: 1}
		];*/
		const buttons = quiz.results.map((result, index) => <Button
			key={result.uid}
			style={styles.button}
			text={(index + 1) + '. ' + result.name + ' (' + result.totalAnsweredCorrect + ')'}
			progress={result.totalAnsweredCorrect / result.totalQuestionsWithAnswer}
			styleClass='vote'
		/>);
		return <ScrollView style={[style, styles.main]} >
			<Text style={styles.title}>Resultaten:</Text>
			{buttons}
		</ScrollView>
	}
}
export default connect(({quiz}) => {
	return {quiz};
})(ResultsView);
