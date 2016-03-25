import React, {View, StyleSheet, Image} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
	toolBar: {
		alignItems: 'center',
		backgroundColor: Theme.themeColor,
		flexDirection: 'row',
		height: 64,
		justifyContent: 'space-between',
		paddingTop: 20
	},
	title: {
		resizeMode: 'contain',
		width: 140
	},
	back: {
		marginLeft: 10,
		marginTop: 20,
		width: 38
	},
	logo: {
		marginRight: 10,
		resizeMode: 'contain',
		width: 46
	}
});

export default (props) => {
	const {style, ...viewProps} = props;
	return <View style={[style, styles.toolBar]} {...viewProps}>
		<View style={styles.back} />
		<Image style={styles.title} source={require('../assets/title.png')} />
		<Image style={styles.logo} source={require('../assets/loeffen-wit.png')} />
	</View>;
};
