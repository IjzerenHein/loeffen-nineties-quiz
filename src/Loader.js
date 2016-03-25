import React, {Platform, ActivityIndicatorIOS, ProgressBarAndroid} from 'react-native';

export default (props) => {
  const size = props.size || 'small';
  if (Platform.OS === 'android') {
    return (
      <ProgressBarAndroid 
        style={{height: (size === 'large') ? 30 : 20}}
        styleAttr="Inverse"
        {...props}
      />
    );
  } else {
    return (
      <ActivityIndicatorIOS
        animating={true}
        size={size}
        {...props}
      />
    );
  }
};
