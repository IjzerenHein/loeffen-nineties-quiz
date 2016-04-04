import React, {Platform, View, ActivityIndicatorIOS, ProgressBarAndroid} from 'react-native';

export default (props) => {
  const {size, ...otherProps} = props;
  //style={{height: (size === 'large') ? 30 : 20}}
  if (Platform.OS === 'android') {
    return <View {...otherProps}>
      <ProgressBarAndroid
        color="white"
        styleAttr={size === 'large' ? 'Large' : 'Small'}
      />
    </View>
  } else {
    return (
      <ActivityIndicatorIOS
        animating={true}
        size={size === 'large' ? 'large' : 'small'}
        {...otherProps}
      />
    );
  }
};
