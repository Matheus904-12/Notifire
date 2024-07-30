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
    <View style={[styles.mensagemContainer, item.visualizada && styles.mensagemVisualizada]}>
      <Text style={styles.mensagemTexto}>{item.texto}</Text>
      {!item.visualizada && (
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
    <LinearGradient colors={['#d4e157', '#76c7c0']} style={styles.background}>
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
          placeholderTextColor="#ddd"
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
    justifyContent: 'flex-start',
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
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '90%',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#fff',
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 12,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  mensagensContainer: {
    width: '100%',
  },
  mensagemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  mensagemVisualizada: {
    backgroundColor: '#444',
  },
  mensagemTexto: {
    color: '#fff',
    fontSize: 16,
  },
  buttonLida: {
    backgroundColor: '#2196f3',
    padding: 8,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonExcluir: {
    backgroundColor: '#f44336',
    padding: 8,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
});
