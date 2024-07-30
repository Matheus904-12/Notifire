import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, firestore } from '../firebaseConfig';
import { collection, addDoc, Timestamp, query, onSnapshot, orderBy } from 'firebase/firestore';

export default function SendMessageScreen({ navigation }) {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login'); // Redirecionar para a tela de login se o usuário não estiver autenticado
      return;
    }

    const mensagensQuery = query(collection(firestore, 'mensagens'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(mensagensQuery, (snapshot) => {
      const mensagensList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMensagens(mensagensList);
    });

    return () => unsubscribe();
  }, [user]);

  const enviarMensagem = async () => {
    if (!user) {
      alert('Você precisa estar autenticado para enviar mensagens.');
      return;
    }

    try {
      await addDoc(collection(firestore, 'mensagens'), {
        texto: mensagem,
        usuario: user.email,
        timestamp: Timestamp.fromDate(new Date()),
        visualizada: false,
      });
      setMensagem('');
    } catch (error) {
      console.error('Erro ao enviar mensagem: ', error);
      alert('Erro ao enviar mensagem.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.usuario === user.email ? styles.myMessage : styles.theirMessage]}>
      <Text style={styles.messageText}>{item.texto}</Text>
      <Text style={styles.timestamp}>{item.visualizada ? '✓' : '•'}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#7f7f7f', '#191919', '#000000']} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.buttonImage} />
        </TouchableOpacity>
        <Text style={styles.title}>Luiz Henrique</Text>
        <FlatList
          data={mensagens}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.chat}
          contentContainerStyle={styles.chatContent}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite Aqui"
            value={mensagem}
            onChangeText={setMensagem}
            placeholderTextColor="#fff"
          />
          <TouchableOpacity style={styles.sendButton} onPress={enviarMensagem}>
            <Image source={require('../assets/send.png')} style={styles.buttonImage} />
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  buttonImage: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    top: 60,
  },
  chat: {
    flex: 1,
    width: '100%',
    marginTop: 120,
  },
  chatContent: {
    paddingBottom: 80,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0078FF',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#444',
  },
  messageText: {
    color: '#fff',
  },
  timestamp: {
    color: '#bbb',
    fontSize: 10,
    textAlign: 'right',
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
    backgroundColor: '#333',
    borderRadius: 15,
    marginRight: 10,
    color: '#fff',
  },
  sendButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
});
