import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatMessage = ({ message, sender, isCurrentUser }) => {
  return (
    <View style={[styles.messageContainer, isCurrentUser ? styles.currentUser : styles.otherUser]}>
      <View style={styles.bubble}>
        <Text style={styles.senderText}>{sender}</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    alignItems: 'flex-start',
  },
  currentUser: {
    alignItems: 'flex-end', // Align messages from the current user to the right
  },
  otherUser: {
    alignItems: 'flex-start', // Align messages from other users to the left
  },
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#f1f1f1', // Default for other users
  },
  currentUserBubble: {
    backgroundColor: '#007bff', // Blue for current user
  },
  senderText: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
});

export default ChatMessage;
