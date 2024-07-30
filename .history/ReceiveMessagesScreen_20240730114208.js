import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { firestore } from './notiFire/firebaseConfig';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';

export default function ReceiveMessagesScreen() {
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    const q = query(collection(firestore, 'mensagens'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const mensagensArray = [];
      querySnapshot.forEach((doc) => {
        mensagensArray.push({ ...doc.data(), id: doc.id });
      });
      setMensagens(mensagensArray);
    });

    return () => unsubscribe();
  }, []);

  const marcarComoVisualizada = async (id) => {
    try {
      const messageDoc = doc(firestore, 'mensagens', id);
      await updateDoc(messageDoc, {
        visualizada: true,
      });
      alert('Mensagem marcada como visualizada.');
    } catch (error) {
      console.error('Erro ao marcar mensagem como visualizada: ', error);
      alert('Erro ao marcar mensagem como visualizada.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.visualizada && styles.visualized]}>
      <Text style={styles.messageText}>{item.texto}</Text>
      {!item.visualizada && (
        <TouchableOpacity style={styles.button} onPress={() => marcarComoVisualizada(item.id)}>
          <Text style={styles.buttonText}>Marcar como visualizada</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#7f7f7f', '#191919', '#000000']} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Mensagens Recebidas</Text>
        <FlatList
          data={mensagens}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  messageList: {
    width: '100%',
  },
  messageContainer: {
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 10,
  },
  visualized: {
    backgroundColor: '#555',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});
