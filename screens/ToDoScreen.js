import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, auth } from '../services/firebase';

const ToDoScreen = ({ navigation }) => {
  const [groupedTasks, setGroupedTasks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error('User is not authenticated');
        setLoading(false);
        return;
      }

      const unsubscribe = db
        .collection('tasks')
        .where('userId', '==', currentUser.uid)
        .onSnapshot(snapshot => {
          const tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          const grouped = tasks.reduce((acc, task) => {
            const date = task.date || 'No Date'; // Handle undefined date
            const day = task.day || 'No Day'; // Handle undefined day
            const dateDay = `${date} (${day})`; // Combine date and day
            if (!acc[dateDay]) {
              acc[dateDay] = [];
            }
            acc[dateDay].push(task);
            return acc;
          }, {});
          setGroupedTasks(grouped);
          setLoading(false);
        });

      return unsubscribe;
    };

    if (auth.currentUser) {
      fetchTasks();
    } else {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          fetchTasks();
        }
      });
      return unsubscribe;
    }
  }, []);

  const deleteTask = (id) => {
    db.collection('tasks').doc(id).delete();
  };

  const markAsDone = (id) => {
    db.collection('tasks').doc(id).update({ completed: true });
  };

  const renderTask = ({ item }) => (
    <View style={styles.task}>
      <Text style={item.completed ? styles.completedTask : null}>{item.text}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => markAsDone(item.id)} style={styles.button}>
          <Icon name="check" size={20} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.button}>
          <Icon name="times" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#8A2BE2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>✓ My To-Do List</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>✓ My To-Do List</Text>
        <View style={{ width: 40 }} />
      </View>
      {Object.keys(groupedTasks).map(dateDay => (
        <View key={dateDay} style={styles.group}>
          <Text style={styles.dateHeader}>{dateDay}</Text>
          <FlatList
            data={groupedTasks[dateDay]}
            renderItem={renderTask}
            keyExtractor={item => item.id}
          />
        </View>
      ))}
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
  group: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  task: {
    padding: 16,
    backgroundColor: 'LightGoldenRodYellow',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
    backgroundColor: 'transparentyellow',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 8,
  },
});

export default ToDoScreen;
