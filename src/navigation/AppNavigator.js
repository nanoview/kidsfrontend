import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth } from "../services/firebase"; // Import Firebase auth

// Import screens
import DashboardScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ToDoScreen from "../screens/ToDoScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import BookListScreen from "../screens/BookListScreen";
import RoutinesScreen from "../screens/RoutinesScreen";
import LoginScreen from "../screens/LoginScreen"; // Import your login screen

const Tab = createBottomTabNavigator();

const TopNavBar = () => (
  <View style={styles.topNavBar}>
    <Text style={styles.navTitle}>Your App Title</Text>
  </View>
);

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Set to true if user exists, otherwise false
    });
    return unsubscribe; // Cleanup on component unmount
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        {isAuthenticated ? (
          <>
            {/* Top Navbar */}
            <TopNavBar />
            {/* Tab Navigator */}
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === "Dashboard") iconName = "home";
                  else if (route.name === "Profile") iconName = "user";
                  else if (route.name === "ToDo") iconName = "list";
                  else if (route.name === "ChatRoom") iconName = "comments";
                  else if (route.name === "BookList") iconName = "book";
                  else if (route.name === "Routines") iconName = "calendar";

                  return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#ff6347",
                tabBarInactiveTintColor: "gray",
                headerShown: false, // Remove individual screen headers
              })}
            >
              <Tab.Screen name="Dashboard" component={DashboardScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
              <Tab.Screen name="ToDo" component={ToDoScreen} />
              <Tab.Screen name="ChatRoom" component={ChatRoomScreen} />
              <Tab.Screen name="BookList" component={BookListScreen} />
              <Tab.Screen name="Routines" component={RoutinesScreen} />
            </Tab.Navigator>
          </>
        ) : (
          <LoginScreen />
        )}
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNavBar: {
    height: 50,
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
  },
  navTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AppNavigator;
