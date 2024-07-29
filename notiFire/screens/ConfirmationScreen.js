import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ConfirmationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Sua mensagem foi enviada com sucesso!</Text>
      <Button title="Enviar Outra" onPress={() => navigation.navigate('SendMessage')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
});
