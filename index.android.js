import {AppRegistry, UIManager} from 'react-native';
import AppView from './src/AppView';

//Press Cmd+R to reload,{'\n'}
//Cmd+D or shake for dev menu

UIManager.setLayoutAnimationEnabledExperimental(true);
AppRegistry.registerComponent('LoeffenNinetiesQuiz', () => AppView);
