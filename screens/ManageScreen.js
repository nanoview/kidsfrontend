//ManageScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');
const TOOL_SIZE = (width - 60) / 2;

const ManageScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [animatedValues] = useState(
    Array(7).fill(null).map(() => new Animated.Value(1))
  );

  const managementTools = [
    {
      id: 1,
      name: 'Reports',
      icon: 'bar-chart',
      color: '#FF6B6B',
      action: () => alert('Reports - Coming Soon!'),
      emoji: '📊',
    },
    {
      id: 2,
      name: 'Settings',
      icon: 'cog',
      color: '#4ECDC4',
      action: () => alert('Settings - Coming Soon!'),
      emoji: '⚙️',
    },
    {
      id: 3,
      name: 'Activity',
      icon: 'history',
      color: '#FFE66D',
      action: () => alert('Activity Log - Coming Soon!'),
      emoji: '📝',
    },
    {
      id: 4,
      name: 'Notifications',
      icon: 'bell',
      color: '#95E1D3',
      action: () => alert('Notifications - Coming Soon!'),
      emoji: '�',
    },
    {
      id: 5,
      name: 'Add Routine',
      icon: 'plus-circle',
      color: '#FF9A9E',
      action: () => navigation.navigate('RoutineForm'),
      emoji: '➕',
    },
    {
      id: 6,
      name: 'Add Task',
      icon: 'check-square',
      color: '#B19CD9',
      action: () => navigation.navigate('ToDoForm'),
      emoji: '\u270f\ufe0f',
    },
    {
      id: 7,
      name: 'Edit Profile',
      icon: 'user-edit',
      color: '#C7CEEA',
      action: () => navigation.navigate('ProfileForm'),
      emoji: '\ud83d\udcc4',
    },
  ];

  const handlePressIn = (index) => {
    Animated.spring(animatedValues[index], {
      toValue: 0.9,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(animatedValues[index], {
      toValue: 1,
    }).start();
  };

  const ToolCard = ({ tool, index }) => {
    const animatedStyle = {
      transform: [{ scale: animatedValues[index] }],
    };

    return (
      <Animated.View style={animatedStyle} key={tool.id}>
        <TouchableOpacity
          style={[
            styles.toolCard,
            { backgroundColor: tool.color, width: TOOL_SIZE, height: TOOL_SIZE },
          ]}
          onPress={tool.action}
          onPressIn={() => handlePressIn(index)}
          onPressOut={() => handlePressOut(index)}
          activeOpacity={0.8}
        >
          <View style={styles.toolContent}>
            <Text style={styles.toolEmoji}>{tool.emoji}</Text>
            <Icon name={tool.icon} size={40} color="#fff" style={styles.toolIcon} />
            <Text style={styles.toolName}>{tool.name}</Text>
          </View>
          <View style={styles.toolGlow} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚙️ Manage</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.toolsGrid}>
          {managementTools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoEmoji}>💡</Text>
            <Text style={styles.infoText}>Manage your child's account and view activity here</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  toolCard: {
    borderRadius: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 8px 10px rgba(0, 0, 0, 0.3)',
    elevation: 12,
    position: 'relative',
  },
  toolContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  toolIcon: {
    marginVertical: 8,
  },
  toolName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  toolGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    opacity: 0.1,
    backgroundColor: '#fff',
  },
  bottomSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  infoEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default ManageScreen;
