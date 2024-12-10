//DashboardScreen.js
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Card from '../components/Card';

const DashboardScreen = ({ navigation }) => {
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

export default DashboardScreen;
