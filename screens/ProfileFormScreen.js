//ProfileFormScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from 'react-native-paper';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const ProfileFormScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [favoriteSubjects, setFavoriteSubjects] = useState('');
  const [interests, setInterests] = useState('');
  const [achievements, setAchievements] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          const profileDoc = await db.collection('profiles').doc(user.uid).get();
          if (profileDoc.exists) {
            const data = profileDoc.data();
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setNickname(data.nickname || '');
            setDateOfBirth(data.dateOfBirth || '');
            setSchoolName(data.schoolName || '');
            setGrade(data.grade || '');
            setClassName(data.className || '');
            setRollNumber(data.rollNumber || '');
            setParentPhone(data.parentPhone || '');
            setHobbies(data.hobbies || '');
            setFavoriteSubjects(data.favoriteSubjects || '');
            setInterests(data.interests || '');
            setAchievements(data.achievements || '');
            setEmergencyContact(data.emergencyContact || '');
            setEmergencyPhone(data.emergencyPhone || '');
            setProfilePicture(data.profilePictureUrl || null);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to set a profile picture');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter first and last name');
      return;
    }

    try {
      setLoading(true);
      await db.collection('profiles').doc(user.uid).set(
        {
          firstName,
          lastName,
          nickname,
          dateOfBirth,
          schoolName,
          grade,
          className,
          rollNumber,
          parentPhone,
          hobbies,
          favoriteSubjects,
          interests,
          achievements,
          emergencyContact,
          emergencyPhone,
          profilePictureUrl: profilePicture,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📝 Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          {/* Profile Picture */}
          <View style={styles.profilePictureSection}>
            <TouchableOpacity onPress={selectImage}>
              <Image
                source={
                  profilePicture
                    ? { uri: profilePicture }
                    : require('../assets/default-profile.png')
                }
                style={styles.profilePicture}
              />
              <View style={styles.uploadBadge}>
                <Icon name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.uploadText}>Tap to change photo</Text>
          </View>

          {/* Personal Information */}
          <Text style={styles.sectionTitle}>👤 Personal Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., John"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., Doe"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nickname</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., Johnny"
              value={nickname}
              onChangeText={setNickname}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="YYYY-MM-DD"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholderTextColor="#999"
            />
          </View>

          {/* School Information */}
          <Text style={styles.sectionTitle}>🎓 School Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>School Name</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., St. Mary's School"
              value={schoolName}
              onChangeText={setSchoolName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Grade</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., 5, 6, 7"
              value={grade}
              onChangeText={setGrade}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Class</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., A, B, C"
              value={className}
              onChangeText={setClassName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Roll Number</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., 15"
              value={rollNumber}
              onChangeText={setRollNumber}
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          {/* Parent Information */}
          <Text style={styles.sectionTitle}>👨‍👩‍👧 Parent Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Parent/Guardian Phone</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., +1234567890"
              value={parentPhone}
              onChangeText={setParentPhone}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          {/* About Me */}
          <Text style={styles.sectionTitle}>🎨 About Me</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Hobbies</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., Drawing, Playing Guitar, Coding"
              value={hobbies}
              onChangeText={setHobbies}
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Favorite Subjects</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., Mathematics, Science, English"
              value={favoriteSubjects}
              onChangeText={setFavoriteSubjects}
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Interests & Skills</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., Sports, Music, Technology, Art"
              value={interests}
              onChangeText={setInterests}
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Achievements & Awards</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., Science Fair Winner, Football Champion"
              value={achievements}
              onChangeText={setAchievements}
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Emergency Contact */}
          <Text style={styles.sectionTitle}>🆘 Emergency Contact</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Emergency Contact Name</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., Uncle John, Grandma"
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Emergency Contact Phone</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="E.g., +1234567890"
              value={emergencyPhone}
              onChangeText={setEmergencyPhone}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            <Icon name="save" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoEmoji}>💡</Text>
            <Text style={styles.infoText}>
              Keep your profile updated with accurate information. Your parents can view this information.
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8A2BE2',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  uploadBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8A2BE2',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 12,
    color: '#8A2BE2',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#8A2BE2',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#8A2BE2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    boxShadow: '0 4px 5px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    flexDirection: 'row',
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
});

export default ProfileFormScreen;
