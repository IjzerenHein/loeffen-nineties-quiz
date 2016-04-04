import React, {View, StyleSheet, Image, Platform} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
	toolBar: {
		alignItems: 'center',
		backgroundColor: Theme.themeColor,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	toolBarIOS: {
		height: 64,
		paddingTop: 20
	},
	toolBarAndroid: {
		height: 44
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
	return <View style={[style, styles.toolBar, (Platform.OS === 'ios') ? styles.toolBarIOS : styles.toolBarAndroid]} {...viewProps}>
		<View style={styles.back} />
		<Image style={styles.title} source={require('../assets/title.png')} />
		<Image style={styles.logo} source={require('../assets/loeffen-wit.png')} />
	</View>;
};
