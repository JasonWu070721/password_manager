import React from 'react';
import {View, Button} from 'react-native';
import {Input} from '@rneui/themed';

function LoginScreen(props: any) {
  const navigation = props.navigation;

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Input placeholder="User Name" />
      <Input placeholder="Password" secureTextEntry={true} />

      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

// const LoginScreen = () => {
//   return <LoginScreen />;
// };

export default LoginScreen;
