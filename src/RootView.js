import React, {View, StyleSheet, Text, Image, TextInput, Alert, ScrollView, LayoutAnimation} from 'react-native';
import {connect} from 'react-redux';
import Button from './Button';
import Theme from './Theme';
import Loader from './Loader';
import AuthActions from './auth/actions';

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: Theme.themeColor,
		paddingLeft: 20,
		paddingRight: 20
	},
	main: {
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	footerText: {
		color: Theme.lightColor,
		fontFamily: Theme.fontFamily,
		fontSize: 20,
		textAlign: 'center'
	},
	footerLoader: {
		padding: 20,
		paddingBottom: 40
	},
	footerText2: {
		color: Theme.lightColor,
		fontFamily: Theme.fontFamily,
		fontSize: 16,
		textAlign: 'center'
	},
	imageView: {
		flexDirection: 'row',
		justifyContent: 'center',
		height: 200
	},
	image: {
		height: 200,
		resizeMode: 'contain'
	},
	loader: {
		padding: 20,
		paddingBottom: 40
	},
	buttons: {
		paddingBottom: 20,
		paddingTop: 20
	},
	name: {
		backgroundColor: Theme.themeColor,
		borderRadius: 8,
		borderWidth: 2,
		borderStyle: 'solid',
		borderColor: Theme.lightColor,
		color: Theme.lightColor,
		fontFamily: Theme.fontFamily,
		fontSize: 26,
		height: 54,
		marginBottom: 10,
		textAlign: 'center'
	}
});

class RootView extends React.Component {
	constructor() {
		super();
		this.state = {
			name: undefined,
			viewHeight: 0
		};
		this.onFocusTextInput = this._onFocusTextInput.bind(this);
		this.onBlurTextInput = this._onBlurTextInput.bind(this);
		this.onMeasureHeight = this._onMeasureHeight.bind(this);
	}

	render() {
		if (this._initLayoutAnimation) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		}
		this._initLayoutAnimation = this._initLayoutAnimation || (this.state.viewHeight > 0);
		let footer;
		//console.log('auth: ', this.props.auth.status, ', quiz: ', this.props.quiz.status);
		if ((this.props.quiz.status === 'launchScreen') || (this.props.quiz.status === 'notInitialized')) {
			footer = <View />;
		} else if (this.props.auth.status === 'loggingIn') {
			footer = <Loader style={styles.loader} size='large'/>;
		} else if (this.props.auth.status === 'loggedIn') {
			switch (this.props.quiz.status) {
				case 'notStarted':
					footer = <View>
						<Text style={styles.footerText}>Hoi {this.props.auth.name}, je bent aangemeld!</Text>
						<Text style={styles.footerText2}>De quiz gaat vanzelf van start...</Text>
						<Loader style={styles.footerLoader} size='large'/>
					</View>;
					break;
				case 'started':
					footer = <View>
						<Text style={styles.footerText}>Een moment geduld...</Text>
						<Loader style={styles.footerLoader} size='large'/>
					</View>;
					break;
				case 'finished':
					footer = <View>
						<Text style={styles.footerText}>Dat was het dan,{'\n'}de quiz is afgelopen.{'\n'}</Text>
						<Text style={styles.footerText2}>Bedankt voor het meedoen!{'\n'}Binnenkort zal de App bijgewerkt worden en zullen de vragen en antwoorden hier zichtbaar zijn.</Text>
						<View style={styles.footerLoader} />
					</View>;
					break;
			}
		} else if (this.props.quiz.status === 'finished') {
			footer = <View>
				<Text style={styles.footerText}>Hoi, de Quiz is reeds gespeeld.{'\n'}</Text>
				<Text style={styles.footerText2}>Binnenkort zal de App bijgewerkt worden en zullen de vragen en antwoorden hier zichtbaar zijn.</Text>
				<View style={styles.footerLoader} />
			</View>;
		} else {
			const signingUp = (this.props.auth.status === 'signingUp');
			const editable = (this.props.auth.status === 'loggedOut');
			footer = <View style={styles.buttons} ref='buttons'>
				<TextInput
					style={[styles.name, !editable ? {opacity: 0.5} : undefined]}
					ref='name'
					editable={!signingUp}
					placeholder='vul hier je naam in'
					placeholderTextColor='rgba(255,255,255,0.5)'
					autoCorrect={false}
					onChangeText={(text) => this.setState({name: text})}
					onFocus={this.onFocusTextInput}
					onBlur={this.onBlurTextInput}
				/>
				<Button
					disabled={!editable}
					loading={signingUp}
					text='Deelnemen'
					onPress={() => this._onJoin()} 
				/>
			</View>;
		}	
		return <ScrollView 
			style={styles.scrollView}
			ref='scrollView'
			keyboardDismissMode='interactive'
			onLayout={this.onMeasureHeight}>
			<View style={[styles.main, {height: this.state.viewHeight}]} >
				<View />
				<View style={styles.imageView}>
					<Image style={styles.image} source={require('../assets/logo.png')} />
				</View>
				{footer}
			</View>
		</ScrollView>
	}

	_onJoin() {
		if (!this.state.name) {
			return Alert.alert(
				'Nineties Quiz',
				'Geen naam ingevuld',
				[{text: 'OK', onPress: () => this.refs.name.focus()}]
			);
		}
		this.props.dispatch(AuthActions.signup(this.state.name));
	}

	_onMeasureHeight(event) {
		this.setState({
			viewHeight: event.nativeEvent.layout.height
		});
	}

	_onFocusTextInput() {
		setTimeout(() => {
			let scrollResponder = this.refs.scrollView.getScrollResponder();
			scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
				React.findNodeHandle(this.refs.buttons),
				0,
				true
			);
		}, 50);
	}

	_onBlurTextInput() {
		this.refs.scrollView.scrollTo({y: 0});
	}
}
export default connect((state) => {return {
	auth: state.auth,
	quiz: state.quiz
}})(RootView);
