//ToDoFormScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const ToDoFormScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [taskText, setTaskText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [day, setDay] = useState('Monday');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleAddTask = async () => {
    if (!taskText.trim()) {
      Alert.alert('Error', 'Please enter a task description');
      return;
    }

    if (!date) {
      Alert.alert('Error', 'Please enter a date');
      return;
    }

    try {
      setLoading(true);
      await db.collection('tasks').add({
        userId: user?.uid,
        text: taskText,
        date,
        day,
        priority,
        completed: false,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Task added successfully!');
      // Reset form
      setTaskText('');
      setDate(new Date().toISOString().split('T')[0]);
      setDay('Monday');
      setPriority('Medium');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'High':
        return '#FF6B6B';
      case 'Medium':
        return '#FFE66D';
      case 'Low':
        return '#4ECDC4';
      default:
        return '#8A2BE2';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>✏️ Add Task</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          {/* Task Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>📝 Task Description</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., Complete math homework, Read a book"
              value={taskText}
              onChangeText={setTaskText}
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Date */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>📅 Date</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              placeholderTextColor="#999"
              keyboardType="default"
            />
          </View>

          {/* Day of Week */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>🗓️ Day of Week</Text>
            <View style={[styles.pickerContainer, { borderColor: colors.primary }]}>
              <Picker
                selectedValue={day}
                onValueChange={(itemValue) => setDay(itemValue)}
                style={styles.picker}
              >
                {days.map((d) => (
                  <Picker.Item key={d} label={d} value={d} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Priority */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>⭐ Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    {
                      backgroundColor: getPriorityColor(p),
                      borderWidth: priority === p ? 3 : 1,
                      borderColor: priority === p ? '#333' : '#ccc',
                    },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={styles.priorityText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleAddTask}
            disabled={loading}
          >
            <Icon name="plus" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Adding...' : 'Add Task'}
            </Text>
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoEmoji}>💡</Text>
            <Text style={styles.infoText}>
              Create tasks to keep track of your child's daily activities and homework
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#8A2BE2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    boxShadow: '0 4px 5px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    flexDirection: 'row',
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
});

export default ToDoFormScreen;
