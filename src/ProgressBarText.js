import React, {View, Text, StyleSheet, PropTypes, LayoutAnimation} from 'react-native';
import ViewStylePropTypes from 'ViewStylePropTypes';
import StyleSheetPropType from 'StyleSheetPropType';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		overflow: 'hidden',
		justifyContent: 'center'
	},
	fill: {
		position: 'absolute',
		left: 0,
		top: 0,
		overflow: 'hidden'
	}
});

export default class ProgressBarText extends React.Component {
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
		progress: 0
	};

	constructor() {
		super();
		this.state = {
			containerWidth: 0,
			containerHeight: 0,
			textWidth: 0
		};
		this._onMeasureContainer = (event) => this.onMeasureContainer(event);
		this._onMeasureText = (event) => this.onMeasureText(event);
	}

	render() {
		const {textStyle, progress, children} = this.props;
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		const {containerWidth, containerHeight, textWidth} = this.state;
		const fillWidth = containerWidth * progress;
		const leftPosition = Math.min((containerWidth - textWidth) / 2, fillWidth);
		const {color, backgroundColor, ...style} = StyleSheet.flatten(this.props.style);
		//console.log('containerWidth: ', containerWidth, ', fillWidth: ', fillWidth, ', fillTextLeft: ', fillTextLeft, ', color: ', color, ', progress: ', progress);
		return <View
			style={[
				style,
				styles.container,
				{backgroundColor: backgroundColor}]}
			onLayout={this._onMeasureContainer}>
			<Text
				style={[textStyle, {color: color}]}
				onLayout={this._onMeasureText}>
				{children}
			</Text>
			<View style={[styles.fill, {backgroundColor: color, width: fillWidth, height: containerHeight, paddingLeft: leftPosition}]}>
				<Text style={[textStyle, {color: backgroundColor, marginLeft: 0}]}>{children}</Text>
			</View>
		</View>;
	}

	onMeasureContainer(event) {
		this.setState({
			containerWidth: event.nativeEvent.layout.width,
			containerHeight: event.nativeEvent.layout.height
		});
	}

	onMeasureText(event) {
		this.setState({
			textWidth: event.nativeEvent.layout.width
		});
	}
}
