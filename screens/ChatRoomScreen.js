import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth, db } from '../services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from '../services/firebase';

const ChatRoomScreen = ({ navigation }) => {
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💬 Chat Room</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.messagesContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Text style={styles.messageText}>{item.text}</Text>}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#8A2BE2',
    borderBottomWidth: 1,
    borderBottomColor: '#7619BE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 10,
  },
  messageText: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});

export default ChatRoomScreen;
