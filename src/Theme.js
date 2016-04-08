import {Dimensions} from 'react-native';

const dimensions = Dimensions.get('window');
const height = Math.max(dimensions.height, dimensions.width);

export default {
	fontFamily: 'Lantinghei SC',
	fontSize: (height <= 500) ? 22 : 26,
	//themeColor: '#252559',
	themeColor: '#253762',
	lightColor: '#FFFFFF'
}
