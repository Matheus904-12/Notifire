import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, firestore } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function ReceiveMessageScreen({ navigation }) {
  const [mensagens, setMensagens] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.navigate('Receivemessage');
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
<Text style={styles.title}>Mensagens Recebidas</Text>
<FlatList
data={mensagens}
keyExtractor={item => item.id}
renderItem={({ item }) => (
<View style={styles.mensagemContainer}>
<Text style={styles.mensagemText}>{item.texto}</Text>
<View style={styles.mensagemActions}>
<TouchableOpacity onPress={() => marcarComoVisualizada(item.id)}>
<Text style={styles.mensagemActionText}>Marcar como lida</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => excluirMensagem(item.id)}>
<Text style={styles.mensagemActionText}>Excluir</Text>
</TouchableOpacity>
</View>
</View>
)}
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
},
title: {
fontSize: 24,
fontWeight: 'bold',
color: '#fff',
marginBottom: 20,
textAlign: 'center',
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
mensagemActionText: {
color: '#fff',
fontSize: 14,
},
});