import React, {View, StyleSheet, Text, Image} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
	toolBar: {
		alignItems: 'center',
		backgroundColor: Theme.themeColor,
		flexDirection: 'row',
		height: 64
	},
	title: {
		color: Theme.lightColor,
		flex: 1,
		fontFamily: Theme.fontFamily,
		fontSize: 20,
		paddingTop: 20,
		textAlign: 'center'
	},
	back: {
		marginLeft: 10,
		marginTop: 20,
		width: 38
	},
	logo: {
		marginTop: 20,
		marginRight: 10,
		resizeMode: 'contain',
		width: 46
	}
});

export default (props) => {
	const {style, ...viewProps} = props;
	return <View style={[style, styles.toolBar]} {...viewProps}>
		<View style={styles.back} />
		<Text style={styles.title}>NINETIES QUIZ</Text>
		<Image style={styles.logo} source={require('../assets/loeffen-wit.png')} />
	</View>;
};
