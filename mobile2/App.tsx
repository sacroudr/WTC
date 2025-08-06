// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VoyageScreen from './screens/voyageScreen';
import LoginScreen from './screens/loginSccreen';

export type RootStackParamList = {
  Login: undefined;
  Voyages: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // 👈 Masque le header pour Login
        />
        <Stack.Screen name="Voyages" options={{ headerShown: false }} component={VoyageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
