import React, {View, StyleSheet, Text, Image, TextInput, Alert} from 'react-native';
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
		justifyContent: 'space-between'
	},
	headerText: {
		color: Theme.lightColor,
		fontFamily: Theme.fontFamily,
		fontSize: 40,
		textAlign: 'center',
		paddingTop: 70
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
		justifyContent: 'center'
	},
	image: {
		width: 200,
		resizeMode: 'contain'
	},
	loader: {
		padding: 20,
		paddingBottom: 40
	},
	buttons: {
		padding: 20
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
			name: undefined
		};
	}

	render() {
		let footer;
		switch (this.props.auth.status) {
			case 'loggingIn':
				footer = <Loader style={styles.loader} size='large'/>;
				break;
			case 'loggedIn':
				footer = <View>
					<Text style={styles.footerText}>Hoi {this.props.auth.name}, je bent aangemeld!</Text>
					<Text style={styles.footerText2}>De quiz gaat vanzelf van start...</Text>
					<Loader style={styles.footerLoader} size='large'/>
				</View>;
				break;
			default:
				const signingUp = (this.props.auth.status === 'signingUp');
				const editable = (this.props.auth.status === 'loggedOut');
				footer = <View style={styles.buttons}>
					<TextInput
						style={[styles.name, !editable ? {opacity: 0.5} : undefined]}
						ref='name'
						editable={!signingUp}
						placeholder='vul hier je naam in'
						placeholderTextColor='rgba(255,255,255,0.5)'
						autoCorrect={false}
						onChangeText={(text) => this.setState({name: text})}
					/>
					<Button
						disabled={!editable}
						loading={this.props.auth.status === 'signingUp'}
						text='Deelnemen'
						onPress={() => this._onJoin()} 
					/>
				</View>;
				break;
		}	
		return <View style={styles.main} >
			<Text style={styles.headerText}>NINETIES QUIZ</Text>
			<View style={styles.imageView}>
				<Image style={styles.image} source={require('../assets/loeffen-wit.png')} />
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
