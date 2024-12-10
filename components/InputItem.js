import React, { useState} from 'react';
import { SafeAreaView, View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, auth } from '../services/firebase';
import firebase from 'firebase/compat/app'; // Import firebase
import 'firebase/compat/firestore'; // Import Firestore

const InputItem = () => {
  const [formValues, setFormValues] = useState({
    itemType: 'task', // Default to 'task'
    taskName: '',
    bookTitle: '',
    author: '',
    date: '',
    day: '',
    hour: '',
  });
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
  ]);

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const addItem = async () => {
    if (!auth.currentUser) {
      alert('Please login to add an item');
      console.error('User is not authenticated');
      return;
    }

    if (formValues.itemType === 'task') {
      if (formValues.taskName.trim() === '') {
        alert('Please enter a task name');
        return;
      }

      db.collection('tasks')
        .add({
          text: formValues.taskName,
          date: formValues.date,
          day: formValues.day,
          hour: formValues.hour,
          completed: false,
          userId: auth.currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      setFormValues({
        ...formValues,
        taskName: '',
        date: '',
        day: '',
        hour: '',
      });
    } else if (formValues.itemType === 'book') {
      if (formValues.bookTitle.trim() === '' || formValues.author.trim() === '') {
        alert('Please enter both a book title and an author');
        return;
      }

      db.collection('books')
        .add({
          title: formValues.bookTitle,
          author: formValues.author,
          userId: auth.currentUser.uid,
          startDate: new Date(),
          read: false,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      setFormValues({
        ...formValues,
        bookTitle: '',
        author: '',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => handleChange('itemType', 'task')} style={styles.iconButton}>
          <Icon name="tasks" size={30} color={formValues.itemType === 'task' ? '#1e90ff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChange('itemType', 'book')} style={styles.iconButton}>
          <Icon name="book" size={30} color={formValues.itemType === 'book' ? '#1e90ff' : '#ffa500'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.initialText}>Please click the icons above to add, edit, or delete your tasks and books.</Text>
      <View style={styles.inputContainer}>
        {formValues.itemType === 'task' && (
          <>
            <TextInput
              placeholder="New Task Name"
              value={formValues.taskName}
              onChangeText={(text) => handleChange('taskName', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Date"
              value={formValues.date}
              onChangeText={(text) => handleChange('date', text)}
              style={styles.input}
            />
            <DropDownPicker
              open={open}
              value={formValues.day}
              items={items}
              setOpen={setOpen}
              setValue={(callback) => handleChange('day', callback(formValues.day))}
              setItems={setItems}
              placeholder="Select Day"
              style={styles.input}
              containerStyle={styles.dropdownContainer}
            />
            <TextInput
              placeholder="Hour"
              value={formValues.hour}
              onChangeText={(text) => handleChange('hour', text)}
              style={styles.input}
            />
          </>
        )}

        {formValues.itemType === 'book' && (
          <>
            <TextInput
              placeholder="Book Title"
              value={formValues.bookTitle}
              onChangeText={(text) => handleChange('bookTitle', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Author"
              value={formValues.author}
              onChangeText={(text) => handleChange('author', text)}
              style={styles.input}
            />
          </>
        )}

        <TouchableOpacity onPress={addItem} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add {formValues.itemType === 'task' ? 'Task' : 'Book'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  inputContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    height: 40,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#32cd32', // LimeGreen color
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default InputItem;