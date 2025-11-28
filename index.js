import { LogBox } from 'react-native';
import { registerRootComponent } from 'expo';

import App from './App';

// Suppress non-critical deprecation warnings
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'pointerEvents is deprecated',
  'Tracking Prevention blocked access to storage',
]);

// Ignore warnings matching patterns
LogBox.ignoreAllLogs(false);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
