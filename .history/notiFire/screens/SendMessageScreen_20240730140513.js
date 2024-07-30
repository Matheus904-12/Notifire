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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui"
            value={mensagem}
            onChangeText={setMensagem}
            placeholderTextColor="#fff"
          />
          <TouchableOpacity style={styles.buttonEnviar} onPress={enviarMensagem}>
            <Image source={require('../assets/send.png')} style={styles.buttonSendImage} />
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: -320,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  input: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 30,
    color: '#fff',
    marginRight: 10,
    backgroundColor: '#333',
  },
  buttonEnviar: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSendImage: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
});
