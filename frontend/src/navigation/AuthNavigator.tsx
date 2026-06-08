import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Mengimpor halaman autentikasi
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Mengimpor navigator utama aplikasi
import AppNavigator from './AppNavigator';

// Membuat stack navigator untuk proses autentikasi
const Stack = createNativeStackNavigator<any, any>();

// Komponen navigator autentikasi
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainApp" component={AppNavigator} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
