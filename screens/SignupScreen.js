import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { auth, db } from '../services/firebase'; // Import Firestore
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleSignup = () => {
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        console.log('User registered with:', user);

        // Store additional user details in Firestore
        db.collection('users').doc(user.uid).set({
          firstName,
          lastName,
          nickname,
          dateOfBirth,
          email: user.email,
        });

        navigation.navigate('Dashboard'); // Navigate to Dashboard after successful signup
      })
      .catch(error => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Nickname"
        value={nickname}
        onChangeText={setNickname}
        style={styles.input}
      />
      <TextInput
        placeholder="Date of Birth"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <Text onPress={() => navigation.navigate('Login')} style={{marginTop:20}}>
        Already have an account? Login
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default SignupScreen;
