//RoutineFormScreen.js
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

const RoutineFormScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [activity, setActivity] = useState('');
  const [loading, setLoading] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddRoutine = async () => {
    if (!activity.trim()) {
      Alert.alert('Error', 'Please enter an activity name');
      return;
    }

    if (!startTime || !endTime) {
      Alert.alert('Error', 'Please enter both start and end times');
      return;
    }

    try {
      setLoading(true);
      await db.collection('routines').add({
        userId: user?.uid,
        day,
        startTime,
        endTime,
        activity,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Routine added successfully!');
      // Reset form
      setDay('Monday');
      setStartTime('09:00');
      setEndTime('10:00');
      setActivity('');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>➕ Add Routine</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          {/* Day Picker */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>📅 Day</Text>
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

          {/* Activity Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>🎯 Activity</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., Mathematics, Sports, Music"
              value={activity}
              onChangeText={setActivity}
              placeholderTextColor="#999"
            />
          </View>

          {/* Start Time */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>🕐 Start Time</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="HH:MM (e.g., 09:00)"
              value={startTime}
              onChangeText={setStartTime}
              placeholderTextColor="#999"
              keyboardType="default"
            />
          </View>

          {/* End Time */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>🕑 End Time</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="HH:MM (e.g., 10:00)"
              value={endTime}
              onChangeText={setEndTime}
              placeholderTextColor="#999"
              keyboardType="default"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleAddRoutine}
            disabled={loading}
          >
            <Icon name="plus" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Adding...' : 'Add Routine'}
            </Text>
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoEmoji}>💡</Text>
            <Text style={styles.infoText}>
              Create routines to help organize your child's daily schedule
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#8A2BE2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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

export default RoutineFormScreen;
