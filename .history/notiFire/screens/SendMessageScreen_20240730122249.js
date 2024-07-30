import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, firestore } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function SendMessageScreen({ navigation }) {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    setUserEmail(user.email);
    buscarMensagens();
  }, [user]);

  const buscarMensagens = async () => {
    try {
      const mensagensQuery = query(collection(firestore, 'mensagens'), orderBy('timestamp', 'asc'));
      const querySnapshot = await getDocs(mensagensQuery);
      const mensagensList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMensagens(mensagensList);
    } catch (error) {
      console.error('Erro ao buscar mensagens: ', error);
    }
  };

  const enviarMensagem = async () => {
    if (!user) {
      alert('Você precisa estar autenticado para enviar mensagens.');
      return;
    }

    try {
      await addDoc(collection(firestore, 'mensagens'), {
        texto: mensagem,
        usuario: user.email,
        timestamp: new Date(),
        visualizada: null,
      });
      Alert.alert('Mensagem enviada', 'Sua mensagem foi enviada com sucesso.');
      setMensagem('');
      buscarMensagens();
    } catch (error) {
      console.error('Erro ao enviar mensagem: ', error);
    }
  };

  const marcarComoLida = async (id) => {
    try {
      const mensagemRef = doc(firestore, 'mensagens', id);
      await updateDoc(mensagemRef, {
        visualizada: new Date(),
      });
      buscarMensagens();
    } catch (error) {
      console.error('Erro ao marcar como lida: ', error);
    }
  };

  const excluirMensagem = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'mensagens', id));
      buscarMensagens();
    } catch (error) {
      console.error('Erro ao excluir mensagem: ', error);
    }
  };

  const renderMensagem = ({ item }) => (
    <View style={[styles.mensagemContainer, item.visualizada && styles.mensagemVisualizada]}>
      <Text style={styles.mensagemTexto}>{item.texto}</Text>
      {item.visualizada ? (
        <Text style={styles.mensagemData}>Visualizada em {new Date(item.visualizada).toLocaleString()}</Text>
      ) : (
        <TouchableOpacity style={styles.buttonLida} onPress={() => marcarComoLida(item.id)}>
          <Text style={styles.buttonText}>Marcar como lida</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.buttonExcluir} onPress={() => excluirMensagem(item.id)}>
        <Text style={styles.buttonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#7f7f7f', '#191919', '#000000']} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backButtonImage} />
        </TouchableOpacity>
        <Text style={styles.title}>{userEmail}</Text>
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
        <FlatList
          data={mensagens}
          renderItem={renderMensagem}
          keyExtractor={item => item.id}
          style={styles.mensagensContainer}
        />
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
    marginBottom: 20,
  },
  backButtonImage: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
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
  mensagensContainer: {
    flex: 1,
  },
  mensagemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#222',
    borderRadius: 5,
  },
  mensagemVisualizada: {
    backgroundColor: '#333',
  },
  mensagemTexto: {
    color: '#fff',
    fontSize: 16,
  },
  mensagemData: {
    color: '#00ff00',
    fontStyle: 'italic',
    marginTop: 5,
  },
  buttonLida: {
    backgroundColor: '#00f',
    padding: 8,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonExcluir: {
    backgroundColor: '#f00',
    padding: 8,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
});
