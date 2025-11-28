//MainNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GameDashboardScreen from '../screens/GameDashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ToDoScreen from '../screens/ToDoScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import BookListScreen from '../screens/BookListScreen';
import RoutinesScreen from '../screens/RoutinesScreen';
import ClassroomScreen from '../screens/ClassroomScreen';
import ManageScreen from '../screens/ManageScreen';
import RoutineFormScreen from '../screens/RoutineFormScreen';
import ToDoFormScreen from '../screens/ToDoFormScreen';
import ProfileFormScreen from '../screens/ProfileFormScreen';
import CustomNavigator from '../components/CustomNavigator';

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="MainHome"
      component={GameDashboardScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="ToDo" component={ToDoScreen} />
    <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
    <Stack.Screen name="BookList" component={BookListScreen} />
    <Stack.Screen name="Routines" component={RoutinesScreen} />
    <Stack.Screen name="Classroom" component={ClassroomScreen} />
    <Stack.Screen name="Manage" component={ManageScreen} />
    <Stack.Screen name="RoutineForm" component={RoutineFormScreen} />
    <Stack.Screen name="ToDoForm" component={ToDoFormScreen} />
    <Stack.Screen name="ProfileForm" component={ProfileFormScreen} />
  </Stack.Navigator>
);

export default MainNavigator;