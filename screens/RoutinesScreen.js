import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity,} from 'react-native';
import {Picker} from '@react-native-picker/picker'
import 'firebase/compat/firestore';
import { db } from '../services/firebase';


const RoutinesScreen = () => {
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [className, setClassName] = useState('');
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('routines').onSnapshot((snapshot) => {
      const fetchedRoutines = snapshot.docs.map((doc) => ({
        id: doc.id,
        routine: doc.data().routine,
        day: doc.data().day,
        startTime: doc.data().startTime,
        endTime: doc.data().endTime,
        className: doc.data().className,
      }));
      setRoutines(fetchedRoutines);
    });

    return () => unsubscribe();
  }, []);

  const handleAddRoutine = async () => {
    if (day && startTime && endTime && className) {
      await db.collection('routines').add({
        routine: 'Class Routine',
        day,
        startTime,
        endTime,
        className,
      });
      setDay('Monday');
      setStartTime('');
      setEndTime('');
      setClassName('');
    }
  };

  const handleDeleteRoutine = async (id) => {
    await db.collection('routines').doc(id).delete();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Routines</Text>
      <Picker
        selectedValue={day}
        onValueChange={(itemValue) => setDay(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Monday" value="Monday" />
        <Picker.Item label="Tuesday" value="Tuesday" />
        <Picker.Item label="Wednesday" value="Wednesday" />
        <Picker.Item label="Thursday" value="Thursday" />
        <Picker.Item label="Friday" value="Friday" />
      </Picker>
      <TextInput
        placeholder="Start Time (HH:mm)"
        value={startTime}
        onChangeText={setStartTime}
        style={styles.input}
      />
      <TextInput
        placeholder="End Time (HH:mm)"
        value={endTime}
        onChangeText={setEndTime}
        style={styles.input}
      />
      <TextInput
        placeholder="Class Name"
        value={className}
        onChangeText={setClassName}
        style={styles.input}
      />
      <Button title="Add Routine" onPress={handleAddRoutine} />
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.routineItem}>
            <Text style={styles.routineText}>
              {item.routine} - {item.day} - {item.startTime} to {item.endTime} - {item.className}
            </Text>
            <TouchableOpacity
              onPress={() => handleDeleteRoutine(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  picker: { height: 50, width: '100%', marginBottom: 10 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  routineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  routineText: { fontSize: 16 },
  deleteButton: {
    backgroundColor: '#ff6666',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: { color: '#fff' },
});

export default RoutinesScreen;
