//App.js
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8A2BE2', // Violet color
    accent: '#8A2BE2', // Violet color
  },
};

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />
          <AppNavigator />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
