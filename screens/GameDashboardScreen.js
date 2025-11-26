//GameDashboardScreen.js
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

const GameDashboardScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [animatedValues] = useState(
    Array(7).fill(null).map(() => new Animated.Value(1))
  );

  const tools = [
    {
      id: 1,
      name: 'Routines',
      icon: 'calendar',
      color: '#FF6B6B',
      action: () => navigation.navigate('Routines'),
      emoji: '📅',
    },
    {
      id: 2,
      name: 'To-Do List',
      icon: 'list',
      color: '#4ECDC4',
      action: () => navigation.navigate('ToDo'),
      emoji: '✓',
    },
    {
      id: 3,
      name: 'Chat',
      icon: 'comments',
      color: '#FFE66D',
      action: () => navigation.navigate('ChatRoom'),
      emoji: '💬',
    },
    {
      id: 4,
      name: 'Books',
      icon: 'book',
      color: '#95E1D3',
      action: () => navigation.navigate('BookList'),
      emoji: '📚',
    },
    {
      id: 5,
      name: 'Classroom',
      icon: 'graduation-cap',
      color: '#C7CEEA',
      action: () => navigation.navigate('Classroom'),
      emoji: '🎓',
    },
    {
      id: 6,
      name: 'Profile',
      icon: 'user',
      color: '#FF9A9E',
      action: () => navigation.navigate('Profile'),
      emoji: '👤',
    },
    {
      id: 7,
      name: 'Manage',
      icon: 'cog',
      color: '#B19CD9',
      action: () => navigation.navigate('Manage'),
      emoji: '⚙️',
    },
  ];

  const handlePressIn = (index) => {
    Animated.spring(animatedValues[index], {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(animatedValues[index], {
      toValue: 1,
      useNativeDriver: true,
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
        <Text style={styles.headerTitle}>🎮 My Activities</Text>
        <Text style={styles.headerSubtitle}>Tap a tool to play!</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.toolsGrid}>
          {tools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.motivationalBox}>
            <Text style={styles.motivationalEmoji}>⭐</Text>
            <Text style={styles.motivationalText}>Great job exploring! Keep playing! 🎉</Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
  motivationalBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#FFE66D',
  },
  motivationalEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  motivationalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default GameDashboardScreen;
