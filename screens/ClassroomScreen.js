//ClassroomScreen.js
import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Card from '../components/Card';

const ClassroomScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎓 Classroom</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card title="Class Schedule">
          <Text>Math - Monday 10:00 AM</Text>
          <Text>Science - Wednesday 2:00 PM</Text>
          <Text>English - Friday 1:00 PM</Text>
        </Card>
        <Card title="Assignments">
          <Text>Complete chapter 5 reading by Friday</Text>
          <Text>Project presentation next Tuesday</Text>
        </Card>
        <Card title="Announcements">
          <Text>No school on November 28th</Text>
          <Text>Parent-teacher conference on December 5th</Text>
        </Card>
      </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 30,
  },
});

export default ClassroomScreen;
