import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../services/firebase';

const RoutinesScreen = ({ navigation }) => {
  const [routines, setRoutines] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayEmojis = {
    Monday: '🌟',
    Tuesday: '📚',
    Wednesday: '🎨',
    Thursday: '⚽',
    Friday: '🎉',
    Saturday: '🎮',
    Sunday: '😴',
  };

  useEffect(() => {
    const unsubscribe = db.collection('routines').onSnapshot((snapshot) => {
      const fetchedRoutines = snapshot.docs.map((doc) => ({
        id: doc.id,
        activity: doc.data().activity || doc.data().routine || 'Activity',
        day: doc.data().day || 'Monday',
        startTime: doc.data().startTime || '09:00',
        endTime: doc.data().endTime || '10:00',
      }));
      // Sort by start time
      fetchedRoutines.sort((a, b) => {
        const timeA = a.startTime ? a.startTime : '00:00';
        const timeB = b.startTime ? b.startTime : '00:00';
        return timeA.localeCompare(timeB);
      });
      setRoutines(fetchedRoutines);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteRoutine = async (id) => {
    try {
      await db.collection('routines').doc(id).delete();
    } catch (error) {
      console.log('Error deleting routine:', error);
    }
  };

  // Filter routines by selected day
  const dayRoutines = routines.filter((routine) => routine.day === selectedDay);

  // Get all unique days that have routines
  const daysWithRoutines = [...new Set(routines.map((r) => r.day))];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📅 School Schedule</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Day Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daySelector}
      >
        {days.map((day) => {
          const hasRoutines = daysWithRoutines.includes(day);
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.dayButtonActive,
                !hasRoutines && styles.dayButtonInactive,
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={styles.dayEmoji}>{dayEmojis[day]}</Text>
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDay === day && styles.dayButtonTextActive,
                ]}
              >
                {day.slice(0, 3)}
              </Text>
              {hasRoutines && <View style={styles.routineDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Routines Display */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading schedule...</Text>
        </View>
      ) : dayRoutines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyText}>No classes on {selectedDay}</Text>
          <Text style={styles.emptySubtext}>Add routines from Manage section</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.routinesContainer}>
          <View style={styles.scheduleCard}>
            {dayRoutines.map((routine, index) => (
              <View key={routine.id}>
                <View style={styles.scheduleRow}>
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeText}>{routine.startTime}</Text>
                    <Text style={styles.timeSubtext}>to</Text>
                    <Text style={styles.timeText}>{routine.endTime}</Text>
                  </View>

                  <View style={[styles.activityColumn, { borderLeftColor: getActivityColor(index) }]}>
                    <Text style={styles.activityText}>{routine.activity}</Text>
                    <Text style={styles.durationText}>
                      {calculateDuration(routine.startTime, routine.endTime)} min
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteRoutine(routine.id)}
                  >
                    <Icon name="times" size={16} color="#666" />
                  </TouchableOpacity>
                </View>

                {index < dayRoutines.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoEmoji}>💡</Text>
            <Text style={styles.infoText}>
              {dayRoutines.length} classes scheduled for {selectedDay}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// Helper function to calculate duration
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  try {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    
    return Math.abs(endTotalMin - startTotalMin);
  } catch (error) {
    return 0;
  }
};

// Helper function to get activity color
const getActivityColor = (index) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#C7CEEA', '#FF9A9E', '#B19CD9'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
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
    fontWeight: 'bold',
    color: '#fff',
  },
  daySelector: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayButton: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  dayButtonActive: {
    backgroundColor: '#8A2BE2',
  },
  dayButtonInactive: {
    opacity: 0.5,
  },
  dayEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  dayButtonTextActive: {
    color: '#fff',
  },
  routineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginTop: 4,
  },
  routinesContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  timeColumn: {
    width: 70,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  timeSubtext: {
    fontSize: 10,
    color: '#999',
    marginVertical: 2,
  },
  activityColumn: {
    flex: 1,
    marginLeft: 12,
    paddingLeft: 12,
    borderLeftWidth: 4,
  },
  activityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#888',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
});

export default RoutinesScreen;
