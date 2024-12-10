import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyDrRw9cSeckdFzpzCqJT-Pc0DfeY10hPUw",
  authDomain: "kidsroutineapp-93d4d.firebaseapp.com",
  projectId: "kidsroutineapp-93d4d",
  storageBucket: "kidsroutineapp-93d4d.firebasestorage.app",
  messagingSenderId: "138988674283",
  appId: "1:138988674283:android:464a64a43f6be8b935f2ae"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const database = firebase.database();