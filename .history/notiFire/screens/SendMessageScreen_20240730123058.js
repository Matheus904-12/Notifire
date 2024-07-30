import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, firestore } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function SendMessageScreen({ navigation }) {
  const [mensagem, setMensagem] = useState('');
  const user = auth.currentUser;

  if (!user) {
    navigation.navigate('Login');
    return null;
  }

  const enviarMensagem = async () => {
    try {
      await addDoc(collection(firestore, 'mensagens'), {
        texto: mensagem,
        usuario: user.email,
        timestamp: new Date(),
        visualizada: null,
      });
      Alert.alert('Mensagem enviada', 'Sua mensagem foi enviada com sucesso.');
      setMensagem('');
    } catch (error) {
      console.error('Erro ao enviar mensagem: ', error);
    }
  };

  return (
    <LinearGradient colors={['#7f7f7f', '#191919', '#000000']} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backButtonImage} />
        </TouchableOpacity>
        <Text style={styles.title}>{user.email}</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          value={mensagem}
          onChangeText={setMensagem}
          placeholderTextColor="#fff"
        />
        <TouchableOpacity style={styles.buttonEnviar} onPress={enviarMensagem}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 30,
  },
  backButtonImage: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 100,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#fff',
    fontSize: 16,
  },
  buttonEnviar: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
});
