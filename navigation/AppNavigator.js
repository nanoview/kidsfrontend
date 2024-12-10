import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ToDoScreen from '../screens/ToDoScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import BookListScreen from '../screens/BookListScreen';
import RoutinesScreen from '../screens/RoutinesScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import LandingScreen from '../screens/LandingScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CustomNavigator from '../components/CustomNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TopNavBar = () => (
  <View style={styles.topNavBar}>
    <Text style={styles.navTitle}>Your App Title</Text>
  </View>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') iconName = 'home';
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
      tabBarHideOnKeyboard: true, // Remove individual screen headers
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

const AppNavigator = () => {
  const { user } = useAuth(); // Use the custom hook

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator>
          {user ? (
            <>
              {/* Main Tab Navigator */}
              <Stack.Screen name="Home" component={TabNavigator} options={{ 
                header: () => (
                  <CustomNavigator
                   title="Child Zone"
                    onIconPress1={() => alert('Home Pressed')}
                    onIconPress2={() => alert('Search Pressed')}
                    onIconPress3={() => alert('Settings Pressed')}
                    />
                ) }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNavBar: {
    height: 60,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AppNavigator;
