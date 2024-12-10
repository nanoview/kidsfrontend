import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomNavigator = ({ title, onIconPress1, onIconPress2, onIconPress3 }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={onIconPress1}>
            <Ionicons name="home" size={24} color="Purple" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onIconPress2}>
            <Ionicons name="search" size={24} color="Green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onIconPress3}>
            <Ionicons name="settings" size={24} color="darkbrown" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff', // Ensure the background color matches the container
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
});

export default CustomNavigator;