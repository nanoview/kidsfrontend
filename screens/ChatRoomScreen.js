//ChatRoomScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth, db } from '../services/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from '../services/firebase';

const ChatRoomScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatRoomId, setChatRoomId] = useState(null);
  const [chatRoomInfo, setChatRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student profile and create/get chatroom
  useEffect(() => {
    const fetchStudentProfileAndChatRoom = async () => {
      try {
        if (!auth.currentUser) {
          setLoading(false);
          return;
        }

        // Fetch student profile to get school and class
        const profileDoc = await db.collection('profiles').doc(auth.currentUser.uid).get();
        
        if (!profileDoc.exists) {
          console.warn('No student profile found');
          setLoading(false);
          return;
        }

        const profileData = profileDoc.data();
        const schoolName = profileData?.schoolName || 'Unknown School';
        const className = profileData?.className || 'Unknown Class';
        
        // Create unique chatroom ID based on school and class
        const roomId = `${schoolName.replace(/\s+/g, '_')}_${className.replace(/\s+/g, '_')}`.toLowerCase();
        
        setChatRoomId(roomId);
        setChatRoomInfo({
          schoolName,
          className,
          roomId,
        });

        // Listen to messages in this chatroom
        const unsubscribe = db
          .collection('chatrooms')
          .doc(roomId)
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .limit(50)
          .onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
          });

        setLoading(false);
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching profile or messages:', error);
        setLoading(false);
      }
    };

    fetchStudentProfileAndChatRoom();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !chatRoomId) return;

    try {
      const messageRef = db
        .collection('chatrooms')
        .doc(chatRoomId)
        .collection('messages');

      // Add message to chatroom
      await messageRef.add({
        text: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email || 'Anonymous',
      });

      // Update chatroom metadata
      await db.collection('chatrooms').doc(chatRoomId).set(
        {
          schoolName: chatRoomInfo?.schoolName,
          className: chatRoomInfo?.className,
          lastMessage: input,
          lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💬 Class Chat</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text style={styles.loadingText}>Loading chat room...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!chatRoomId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💬 Class Chat</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="exclamation-triangle" size={50} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Profile Incomplete</Text>
          <Text style={styles.errorText}>
            Please complete your profile with school name and class to access the chatroom.
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('ProfileForm')}
          >
            <Icon name="edit" size={16} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>💬 Class Chat</Text>
          <Text style={styles.headerSubtitle}>
            {chatRoomInfo?.schoolName} - Class {chatRoomInfo?.className}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No messages yet. Be the first to say hello! 👋</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View style={[
                styles.messageItem,
                item.userId === auth.currentUser.uid ? styles.myMessage : styles.otherMessage
              ]}>
                <View>
                  <Text style={styles.senderName}>{item.userName}</Text>
                  <Text style={[
                    styles.messageText,
                    item.userId === auth.currentUser.uid && styles.myMessageText
                  ]}>
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            inverted
          />
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={styles.input}
          multiline
          maxHeight={100}
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Icon name="paper-plane" size={18} color="#fff" />
        </TouchableOpacity>
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E0D5FF',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#8A2BE2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'flex-end',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  messageItem: {
    marginVertical: 6,
    marginHorizontal: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '80%',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#8A2BE2',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  myMessageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderColor: '#8A2BE2',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatRoomScreen;
