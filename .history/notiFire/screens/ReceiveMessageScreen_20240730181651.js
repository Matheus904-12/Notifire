import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, firestore } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Animated, { SlideInRight, SlideOutRight, Layout } from 'react-native-reanimated';

export default function ReceiveMessageScreen({ navigation }) {
  const [mensagens, setMensagens] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
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

  const marcarComoVisualizada = async (id) => {
    try {
      const mensagemRef = doc(firestore, 'mensagens', id);
      await updateDoc(mensagemRef, { visualizada: new Date() });
      buscarMensagens();
    } catch (error) {
      console.error('Erro ao marcar como visualizada: ', error);
    }
  };

  const excluirMensagem = async (id) => {
    try {
      const mensagemRef = doc(firestore, 'mensagens', id);
      await deleteDoc(mensagemRef);
      buscarMensagens();
    } catch (error) {
      console.error('Erro ao excluir mensagem: ', error);
    }
  };

  return (
    <LinearGradient colors={['#7f7f7f', '#191919', '#000000']} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backButtonImage} />
        </TouchableOpacity>
        <Text style={styles.title}>Mensagens Recebidas</Text>
        <FlatList
          data={mensagens}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Animated.View
              entering={SlideInRight.duration(4000)}
              exiting={SlideOutRight.duration(1000)}
              layout={Layout.springify()}
              style={styles.mensagemContainer}
            >
              <Text style={styles.mensagemText}>{item.texto}</Text>
              <View style={styles.mensagemActions}>
                <TouchableOpacity onPress={() => marcarComoVisualizada(item.id)} style={styles.button}>
                  <Text style={styles.mensagemActionText}>Marcar como lida</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluirMensagem(item.id)} style={styles.button}>
                  <Text style={styles.mensagemActionText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
          contentContainerStyle={styles.mensagensContentContainer}
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
    padding: 20,
    paddingTop: 60,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  mensagensContentContainer: {
    paddingBottom: 60,
  },
  mensagemContainer: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  mensagemText: {
    color: '#fff',
    fontSize: 16,
  },
  mensagemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#555',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  mensagemActionText: {
    color: '#fff',
    fontSize: 14,
  },
});
