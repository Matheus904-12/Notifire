import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import SendMessageScreen from './screens/SendMessageScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Login/Cadastro', headerShown: false }} />
        <Stack.Screen name="SendMessage" component={SendMessageScreen} options={{ title: 'Enviar Mensagem', headerShown: false }} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} options={{ title: 'Confirmação', headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}