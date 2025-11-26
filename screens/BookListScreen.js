import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, auth } from '../services/firebase';

const BookListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [itemType, setItemType] = useState('book'); // Default to 'book'

  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = db
        .collection('books')
        .where('userId', '==', auth.currentUser.uid) // Filter books by the current user's UID
        .onSnapshot(snapshot =>
          setBooks(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        );
      return unsubscribe;
    } else {
      console.log("No user is logged in");
    }
  }, []);

  const markAsRead = (id) => {
    db.collection('books')
      .doc(id)
      .update({ read: true, endDate: new Date() });
  };

  if (!auth.currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#8A2BE2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📘 My Books</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.initialText}>Please log in to view your book list.</Text>
      </SafeAreaView>
    );
  }

  const renderBook = ({ item }) => (
    <View style={styles.bookItem}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>Author: {item.author}</Text>
      <Text style={styles.bookDate}>Date: {new Date(item.startDate.seconds * 1000).toLocaleDateString()}</Text>
      {!item.read && (
        <TouchableOpacity onPress={() => markAsRead(item.id)} style={styles.readButton}>
          <Icon name="check" size={20} color="green" />
        </TouchableOpacity>
      )}
    </View>
  );

  const readBooks = books.filter(book => book.read);
  const currentBooks = books.filter(book => !book.read);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📚 My Books</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setItemType('book')} style={styles.iconButton}>
          <Icon name="book" size={30} color={itemType === 'book' ? '#1e90ff' : '#000'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subHeader}>Read Books</Text>
      <FlatList
        data={readBooks}
        renderItem={renderBook}
        keyExtractor={item => item.id}
        style={styles.list}
      />
      <Text style={styles.subHeader}>Currently Reading</Text>
      <FlatList
        data={currentBooks}
        renderItem={renderBook}
        keyExtractor={item => item.id}
        style={styles.list}
      />
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8A2BE2',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f8ff', // AliceBlue background color
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconButton: {
    marginHorizontal: 20,
  },
  initialText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#555',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#ff6347', // Tomato color
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e90ff', // DodgerBlue color
  },
  listContainer: {
    flex: 1,
  },
  list: {
    marginBottom: 20,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#555',
  },
  bookDate: {
    fontSize: 14,
    color: '#555',
  },
  readButton: {
    padding: 5,
  },
});

export default BookListScreen;
