import React, {StyleSheet, TouchableOpacity, PropTypes} from 'react-native';
import tinycolor from 'tinycolor2';
import Theme from './Theme';
import ProgressText from './ProgressText';
import Loader from './Loader';

const styles = StyleSheet.create({
	regular: {
		color: Theme.themeColor,
		backgroundColor: Theme.lightColor,
		borderStyle: 'solid',
		borderWidth: 1,
		borderRadius: 8
	},
	vote: {
		color: Theme.themeColor,
		backgroundColor: tinycolor(Theme.themeColor).setAlpha(0.5).toString(),
		borderRadius: 8
	},
	regularTextStyle: {
		fontFamily: Theme.fontFamily,
		fontSize: 26,
		margin: 5,
		textAlign: 'center'
	},
	voteTextStyle: {
		fontFamily: Theme.fontFamily,
		fontSize: 26,
		margin: 5,
		textAlign: 'left',
		marginLeft: 20
	},
	loader: {
		marginTop: 8,
		marginBottom: 9
	}
});

export default class Button extends React.Component {

	static propTypes = {
		disabled: PropTypes.bool,
		highlighted: PropTypes.bool,
		onPress: PropTypes.func,
		progress: PropTypes.number,
		text: PropTypes.string,
		styleClass: PropTypes.oneOf(['regular', 'vote'])
	};

	static defaultProps = {
		progress: 0,
		styleClass: 'regular'
	};

	constructor() {
		super();
		this.onPress = () => this._onPress();
	}

	render() {
		const {disabled, text, style, styleClass, progress, onPress, ...props} = this.props;
		const content = this.props.loading ?
			<Loader style={styles.loader} /> :
			<ProgressText
				style={styles[styleClass]}
				textStyle={styles[styleClass + 'TextStyle']}
				textColor={(styleClass === 'vote') ? Theme.lightColor : undefined}
				progress={progress}>
				{text}
			</ProgressText>
		return <TouchableOpacity
			activeOpacity={0.7}
			disabled={disabled}
			style={style}
			onPress={this.onPress} {...props}>
			{content}
		</TouchableOpacity>;
	}

	_onPress() {
		if (!this.props.loading && this.props.onPress) {
			this.props.onPress();
		}
	}
}
