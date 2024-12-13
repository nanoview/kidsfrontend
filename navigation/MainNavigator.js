import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import DashboardScreen from '../screens/DashboardScreen';
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
        else if (route.name === 'Profile') iconName = 'user';
        else if (route.name === 'ToDo') iconName = 'list';
        else if (route.name === 'ChatRoom') iconName = 'comments';
        else if (route.name === 'BookList') iconName = 'book';
        else if (route.name === 'Routines') iconName = 'calendar';
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#ff6347',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarHideOnKeyboard: true,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="ToDo" component={ToDoScreen} />
    <Tab.Screen name="ChatRoom" component={ChatRoomScreen} />
    <Tab.Screen name="BookList" component={BookListScreen} />
    <Tab.Screen name="Routines" component={RoutinesScreen} />
  </Tab.Navigator>
);

const MainNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={TabNavigator} options={{
      header: () => (
        <CustomNavigator
          title="Child Zone"
          onIconPress1={() => alert('Home Pressed')}
          onIconPress2={() => alert('Search Pressed')}
          onIconPress3={() => alert('Settings Pressed')}
        />
      )
    }} />
  </Stack.Navigator>
);

export default MainNavigator;