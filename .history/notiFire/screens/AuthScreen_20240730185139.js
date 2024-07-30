import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const entrar = () => {
    signInWithEmailAndPassword(auth, email, senha)
      .then(userCredential => {
        navigation.navigate('ReceiveMessage');
      })
      .catch(error => alert(error.message));
  };

  return (
    <LinearGradient colors={['#7f7f7f', '#191919', '#000000']} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backButtonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoButton} onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/info.png')} style={styles.infoButtonImage} />
        </TouchableOpacity>
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Faça o login para começar</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#fff"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholderTextColor="#fff"
        />
        <TouchableOpacity style={styles.button} onPress={entrar}>
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.registerButtonText}>Não sou cadastrado :(</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Matheus Lucindo</Text>
              <Text style={styles.modalText}>Luiz Henrique</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  infoButton: {
    position: 'absolute',
    top: 60,
    right: 30,
  },
  infoButtonImage: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
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
  registerButton: {
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
