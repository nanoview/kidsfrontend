//LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { colors } = useTheme();
  
  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Call Firebase sign-in method
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      
      console.log('Login successful:', userCredential.user.email);
      // Navigation will happen automatically via AppNavigator when user state changes
      
    } catch (error) {
      console.log('Login error:', error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Icon name="smile-o" size={50} color={colors.primary} style={styles.icon} />
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError('');
        }}
        editable={!loading}
        style={[styles.input, { borderColor: colors.primary }]}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError('');
        }}
        editable={!loading}
        secureTextEntry
        style={[styles.input, { borderColor: colors.primary }]}
      />
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('ForgotPassword')} 
        style={styles.link}
        disabled={loading}
      >
        <Text style={styles.linkText}>Forgot Password? Reset Here</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Signup')}
        disabled={loading}
      >
        <Text style={[styles.linkText, { color: colors.accent }]}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
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
  buttonDisabled: {
    opacity: 0.6,
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;
