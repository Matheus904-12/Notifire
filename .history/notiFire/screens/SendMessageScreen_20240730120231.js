import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, firestore } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function SendMessageScreen({ navigation }) {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
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
    <View style={styles.mensagemContainer}>
      <Text style={styles.mensagemTexto}>{item.texto}</Text>
      {item.visualizada ? (
        <Text style={styles.mensagemVisualizada}>Visualizada em {new Date(item.visualizada).toLocaleString()}</Text>
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
        <Text style={styles.title}>Enviar Mensagem</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          value={mensagem}
          onChangeText={setMensagem}
          placeholderTextColor="#fff"
        />
        <TouchableOpacity style={styles.button} onPress={enviarMensagem}>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  mensagensContainer: {
    width: '100%',
  },
  mensagemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  mensagemTexto: {
    color: '#fff',
  },
  mensagemVisualizada: {
    color: '#00ff00',
    fontStyle: 'italic',
  },
  buttonLida: {
    backgroundColor: '#00f',
    padding: 5,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonExcluir: {
    backgroundColor: '#f00',
    padding: 5,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
});
