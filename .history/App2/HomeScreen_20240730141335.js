import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#7f7f7f', '#191919', '#000000']}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require('../assets/logo.gif')} style={styles.logo} />
        <Text style={styles.title}>Notificações Organizadas</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Auth')}>
          <Text style={styles.buttonText}>Vamos Lá</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'semi-bold',
    top: -20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
