import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { auth, db,  } from '../services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from '../services/firebase'; // Add this line

const ChatRoomScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const unsubscribe = db.collection('classroom')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => setMessages(snapshot.docs.map(doc => doc.data())));

    return unsubscribe;
  }, []);

  const sendMessage = () => {
    db.collection('classroom').add({
      text: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userId: auth.currentUser.uid,
    });
    setInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
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

export default ChatRoomScreen;
