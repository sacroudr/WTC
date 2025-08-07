// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VoyageScreen from './screens/voyageScreen';

import DocumentScreen from './screens/documentScreen';
import ChargementCamionScreen from './screens/chargementCamionScreen';
import LoginScreen from './screens/loginScreen';
import { RootStackParamList } from './navigation/types';

// export type RootStackParamList = {
//   Login: undefined;
//   Voyages: undefined;
//   Documents: undefined;
//   ChargementCamion: undefined;
// };

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Voyages" options={{ headerShown: false }} component={VoyageScreen} />
        <Stack.Screen name="Documents" options ={{ headerShown: false, animation:'none' }} component={DocumentScreen} />
        <Stack.Screen name="ChargementCamion" options ={{ headerShown: false, animation:'none' }} component={ChargementCamionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
