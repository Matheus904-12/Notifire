import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './screens/AuthScreen';
import SendMessageScreen from './screens/SendMessageScreen';
import ReceiveMessagesScreen from './screens/ReceiveMessagesScreen';  // Verifique o caminho do arquivo
import CadastroScreen from './screens/CadastroScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SendMessage" component={SendMessageScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ReceiveMessages" component={ReceiveMessagesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
