import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { auth } from '../services/firebase';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = ({ route }) => {
  const { userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(userId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => setMessages(snapshot.docs.map(doc => doc.data())));

    return unsubscribe;
  }, [userId]);

  const sendMessage = () => {
    firestore()
      .collection('chats')
      .doc(userId)
      .collection('messages')
      .add({
        text: input,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: auth.currentUser.uid,
      });
    setInput('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(_, index) => index.toString()}
      />
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type a message"
        style={styles.input}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default ChatScreen;
