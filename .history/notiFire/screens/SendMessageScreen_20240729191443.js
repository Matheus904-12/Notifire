// screens/SendMessageScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore } from '../firebaseConfig'; // Verifique se o caminho está correto
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function SendMessageScreen({ navigation }) {
  const [mensagem, setMensagem] = useState('');

  const enviarMensagem = async () => {
    try {
      await addDoc(collection(firestore, 'messages'), {
        text: mensagem,
        createdAt: serverTimestamp(),
      });
      setMensagem('');
      alert('Mensagem enviada!');
      navigation.navigate('Confirmation');
    } catch (error) {
      console.error("Erro ao enviar mensagem: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite sua mensagem"
        value={mensagem}
        onChangeText={setMensagem}
      />
      <TouchableOpacity style={styles.button} onPress={enviarMensagem}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
