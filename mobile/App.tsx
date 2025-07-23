// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import CamionScreen from './screens/camionScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Camion">
//         <Stack.Screen name="Camion" component={CamionScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/loginScreen';
import CamionScreen from './screens/camionScreen';

export type RootStackParamList = {
  Login: undefined;
  Camions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Camions" component={CamionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
