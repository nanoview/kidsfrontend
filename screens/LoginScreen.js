//LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const { colors } = useTheme();
  const handleLogin = async () => {
    try {
      // Call Firebase sign-in method
      const userCredential = await auth.signInWithEmailAndPassword(email, password);

      // Set the user in the context
      setUser(userCredential.user);

      // Navigate to HomeScreen
      navigation.navigate('MainHome');
    } catch (error) {
      // Handle and display errors
      alert(error.message);
    }
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Icon name="smile-o" size={50} color={colors.primary} style={styles.icon} />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { borderColor: colors.primary }]}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { borderColor: colors.primary }]}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.link}>
        <Text style={styles.linkText}>Forgot Password? Reset Here</Text>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate('Signup')} style={[styles.linkText, { color: colors.accent }]}>
        Don't have an account? Sign Up
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
  },
});

export default LoginScreen;