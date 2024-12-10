import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../services/firebase';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        setUser(user);
        const userProfile = await db.collection('users').doc(user.uid).get();
        setProfile(userProfile.data());
      }
    };

    fetchUserProfile();
  }, []);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  if (!user) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={selectImage}>
        <Image
          source={profilePicture ? { uri: profilePicture } : require('../assets/default-profile.png')}
          style={styles.profilePicture}
        />
      </TouchableOpacity>
      <Text style={styles.userName}>{profile.firstName} {profile.lastName}</Text>
      <Text style={styles.userDetail}>Nickname: {profile.nickname}</Text>
      <Text style={styles.userDetail}>Date of Birth: {profile.dateOfBirth}</Text>
      <Text style={styles.userDetail}>Email: {user.email}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetail: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default ProfileScreen;
