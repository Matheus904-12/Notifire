import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function SendMessageScreen({ navigation }) {
  const [mensagem, setMensagem] = useState('');
  const user = auth.currentUser;

  const enviarMensagem = async () => {
    try {
      await addDoc(collection(db, 'mensagens'), {
        texto: mensagem,
        usuario: user.email,
        timestamp: Timestamp.fromDate(new Date()),
        visualizada: false,
      });
      setMensagem('');
      alert('Mensagem enviada!');
    } catch (error) {
      console.error('Erro ao enviar mensagem: ', error);
      alert('Erro ao enviar mensagem.');
    }
  };

  return (
    <LinearGradient colors={['#7f7f7f', '#191919', '#000000']} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/back.png')} style={styles.backButtonImage} />
        </TouchableOpacity>
        <Text style={styles.title}>Luiz Henrique</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite Aqui"
            value={mensagem}
            onChangeText={setMensagem}
            placeholderTextColor="#fff"
          />
          <TouchableOpacity style={styles.sendButton} onPress={enviarMensagem}>
            <Image source={require('../assets/images/send.png')} style={styles.sendButtonImage} />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonImage: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    marginRight: 10,
    color: '#000',
  },
  sendButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonImage: {
    width: 30,
    height: 30,
  },
});
