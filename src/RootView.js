import React, {View, StyleSheet, Text, Image, TextInput, Alert, LayoutAnimation, DeviceEventEmitter} from 'react-native';
import {connect} from 'react-redux';
import Button from './Button';
import Theme from './Theme';
import Loader from './Loader';
import AuthActions from './auth/actions';

const styles = StyleSheet.create({
	main: {
		backgroundColor: Theme.themeColor,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		paddingLeft: 20,
		paddingRight: 20
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
		textAlign: 'center',
		marginTop: 20
	},
	imageView: {
		flexDirection: 'row',
		justifyContent: 'center',
		height: 200,
		marginBottom: 20,
		marginTop: 20
	},
	image: {
		height: 200,
		resizeMode: 'contain'
	},
	loader: {
		paddingTop: 20
	},
	buttons: {
		paddingTop: 20
	},
	name: {
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
			keyboardVisible: false
		};
	}

	componentWillMount() {
		this._keyboardWillShow = DeviceEventEmitter.addListener('keyboardWillShow', () => this.setState({keyboardVisible: true}));
		this._keyboardWillHide = DeviceEventEmitter.addListener('keyboardWillHide', () => this.setState({keyboardVisible: false}));
	}

	componentWillUnmount() {
		this._keyboardWillShow.remove();
		this._keyboardWillHide.remove();
	}

	render() {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		let footer;
		if ((this.props.quiz.status === 'launchScreen') || (this.props.quiz.status === 'notInitialized')) {
			footer = <View />;
		} else if (this.props.auth.status === 'loggingIn') {
			footer = <Loader style={styles.loader} size='large'/>;
		} else if (this.props.auth.status === 'loggedIn') {
			switch (this.props.quiz.status) {
				case 'notStarted':
				case 'started':
					footer = <View>
						<Text style={styles.footerText}>Hoi {this.props.auth.name}, je bent aangemeld!</Text>
						<Text style={styles.footerText2}>De quiz gaat vanzelf van start...</Text>
						<Loader style={styles.footerLoader} size='large'/>
					</View>;
					break;
				case 'finished':
					footer = <View>
						<Text style={styles.footerText}>Dat was het dan,{'\n'}de quiz is afgelopen...</Text>
						<Text style={styles.footerText2}>Bedankt voor het meedoen!{'\n'}Binnenkort zal de App bijgewerkt worden en zullen de vragen en antwoorden hier zichtbaar zijn.</Text>
						<View style={styles.footerLoader} />
					</View>;
					break;
			}
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
					underlineColorAndroid='white'
					onChangeText={(text) => this.setState({name: text})}
				/>
				<Button
					disabled={!editable}
					loading={signingUp}
					text='Deelnemen'
					onPress={() => this._onJoin()} 
				/>
			</View>;
		}	
		return <View style={[styles.main, {paddingBottom: this.state.keyboardVisible ? 260 : 0}]} >
			<View style={styles.imageView}>
				<Image style={styles.image} source={require('../assets/logo.png')} />
			</View>
			{footer}
		</View>
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
}
export default connect((state) => {return {
	auth: state.auth,
	quiz: state.quiz
}})(RootView);
