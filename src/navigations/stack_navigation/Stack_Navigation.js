import {  } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../../screens/splashscreen/SplashScreen';
import Login from '../../screens/login/Login';
import NavigationNames from '../../utils/NavigationNames';
import Bottom_Tab_Navigation from '../bottom_tab_navigation/Bottom_Tab_Navigation';
import Wellcome from '../../screens/wellcomescreen/Wellcome';

const Stack = createStackNavigator();
const Stack_Navigation = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator  
    initialRouteName={NavigationNames.SplashScreen}
    screenOptions={{
        headerShown: false,
    }}>
    <Stack.Screen name={NavigationNames.SplashScreen} component={SplashScreen} />
    <Stack.Screen name={NavigationNames.Login} component={Login} />
    <Stack.Screen name={NavigationNames.Bottom_Tab_Navigation} component={Bottom_Tab_Navigation} />
    <Stack.Screen name={NavigationNames.Wellcome} component={Wellcome} />
  </Stack.Navigator>
  </NavigationContainer>
  );
};

export default Stack_Navigation