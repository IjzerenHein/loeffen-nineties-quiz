import React, {View, Text, StyleSheet, PropTypes, LayoutAnimation} from 'react-native';
import ViewStylePropTypes from 'ViewStylePropTypes';
import StyleSheetPropType from 'StyleSheetPropType';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		overflow: 'hidden'
	},
	fill: {
		position: 'absolute',
		left: 0,
		top: 0,
		overflow: 'hidden'
	},
	text: {
		flex: 1
	}
});

export default class ProgressText extends React.Component {
	static propTypes = {
		textStyle: Text.propTypes.style,
		style: StyleSheetPropType({
			...ViewStylePropTypes,
			color: PropTypes.string
		}),
		progress: PropTypes.number
	};

	static defaultProps = {
		style: {
			color: '#0000FF', // fill-color
			backgroundColor: '#FFFFFF'
		},
		textStyle: {
			textAlign: 'center'
		},
		progress: 0,
		textColor: undefined
	};

	constructor() {
		super();
		this.state = {
			containerWidth: 0,
			containerHeight: 0
		};
		this._onMeasureContainer = (event) => this.onMeasureContainer(event);
	}

	render() {
		const {textStyle, progress, children, textColor} = this.props;
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		const {containerWidth, containerHeight} = this.state;
		const fillWidth = containerWidth * progress;
		const {color, backgroundColor, ...style} = StyleSheet.flatten(this.props.style);
		//console.log('containerWidth: ', containerWidth, ', fillWidth: ', fillWidth, ', fillTextLeft: ', fillTextLeft, ', color: ', color, ', progress: ', progress);
		return <View
			style={[
				style,
				styles.container,
				{backgroundColor: backgroundColor}]}
			onLayout={this._onMeasureContainer}>
			<View style={[styles.fill, {backgroundColor: color, width: fillWidth, height: containerHeight}]} />
			<Text style={[textStyle, {color: textColor || color}, styles.text]}>
				{children}
			</Text>
		</View>;
	}

	onMeasureContainer(event) {
		this.setState({
			containerWidth: event.nativeEvent.layout.width,
			containerHeight: event.nativeEvent.layout.height
		});
	}
}
