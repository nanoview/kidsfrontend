//DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

const Home = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      console.log('Logged in user email:', currentUser.email);
      console.log('Logged in user ID:', currentUser.uid);
    }
    setLoading(false);
  }, [currentUser]); // Added missing dependency array and closing bracket

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card title="Upcoming Events">
          <Text>School trip to the zoo on Friday.</Text>
        </Card>
        <Card title="Homework">
          <Text>Finish math exercises 1-10.</Text>
        </Card>
        <Card title="Tomorrow">
          <Text>Finish math exercises 1-10.</Text>
        </Card>
        <Card title="Today">
          <Text>Finish math exercises 1-10.</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80, // Ensure content is not hidden behind the bottom row
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  iconButton: {
    padding: 10,
  },
});

export default Home;