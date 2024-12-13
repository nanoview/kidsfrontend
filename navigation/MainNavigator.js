//MainNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ToDoScreen from '../screens/ToDoScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import BookListScreen from '../screens/BookListScreen';
import RoutinesScreen from '../screens/RoutinesScreen';
import CustomNavigator from '../components/CustomNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Profile'){ iconName = 'user'; color ='orange'}
        else if (route.name === 'ToDo'){ iconName = 'list'; color='cyan' }
        else if (route.name === 'ChatRoom'){ iconName = 'comments'; color = 'green'}
        else if (route.name === 'BookList') {iconName = 'book'; color = 'coral'}
        else if (route.name === 'Routines') iconName = 'calendar';
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'violet',
      headerShown: false,
      tabBarHideOnKeyboard: true,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="ToDo" component={ToDoScreen} />
    <Tab.Screen name="ChatRoom" component={ChatRoomScreen} />
    <Tab.Screen name="BookList" component={BookListScreen} />
    <Tab.Screen name="Routines" component={RoutinesScreen} />
  </Tab.Navigator>
);

const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainHome" // Changed from "Home" to "MainHome"
      component={TabNavigator}
      options={{
        header: () => (
          <CustomNavigator
            title="Child Zone"
            onIconPress3={() => alert('Settings Pressed')}
          />
        ),
      }}
    />
  </Stack.Navigator>
);

export default MainNavigator;