import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user) {
          const userProfile = await db.collection('profiles').doc(user.uid).get();
          if (userProfile.exists) {
            setProfile(userProfile.data());
          } else {
            // Set mock data structure if no profile exists
            setProfile({
              firstName: 'Student',
              lastName: 'Name',
              nickname: 'Nick',
              dateOfBirth: '2010-05-15',
              schoolName: 'St. Mary\'s School',
              grade: '5',
              className: 'A',
              rollNumber: '15',
              parentPhone: '+1-555-0123',
              hobbies: 'Drawing, Playing Guitar, Reading',
              favoriteSubjects: 'Mathematics, Science, Art',
              interests: 'Technology, Sports, Music',
              achievements: 'Science Fair Winner 2024, Football Champion',
              emergencyContact: 'John Doe',
              emergencyPhone: '+1-555-0456',
              email: user?.email,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleEditProfile = () => {
    navigation.navigate('ProfileForm');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#8A2BE2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>👤 My Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#8A2BE2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👤 My Profile</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Icon name="edit" size={20} color="#8A2BE2" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={
              profile?.profilePictureUrl
                ? { uri: profile.profilePictureUrl }
                : require('../assets/default-profile.png')
            }
            style={styles.profilePicture}
          />
          <Text style={styles.fullName}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          {profile?.nickname && <Text style={styles.nickname}>"{profile.nickname}"</Text>}
        </View>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👤 Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{profile?.dateOfBirth || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{profile?.email || 'N/A'}</Text>
          </View>
        </View>

        {/* School Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎓 School Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>School Name:</Text>
            <Text style={styles.value}>{profile?.schoolName || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Grade:</Text>
            <Text style={styles.value}>{profile?.grade || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Class:</Text>
            <Text style={styles.value}>{profile?.className || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Roll Number:</Text>
            <Text style={styles.value}>{profile?.rollNumber || 'N/A'}</Text>
          </View>
        </View>

        {/* About Me Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎨 About Me</Text>
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Hobbies:</Text>
            <Text style={styles.descriptionText}>{profile?.hobbies || 'N/A'}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Favorite Subjects:</Text>
            <Text style={styles.descriptionText}>{profile?.favoriteSubjects || 'N/A'}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Interests & Skills:</Text>
            <Text style={styles.descriptionText}>{profile?.interests || 'N/A'}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Achievements:</Text>
            <Text style={styles.descriptionText}>{profile?.achievements || 'N/A'}</Text>
          </View>
        </View>

        {/* Parent Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👨‍👩‍👧 Parent Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Parent/Guardian Phone:</Text>
            <Text style={styles.value}>{profile?.parentPhone || 'N/A'}</Text>
          </View>
        </View>

        {/* Emergency Contact Card */}
        <View style={[styles.card, styles.emergencyCard]}>
          <Text style={styles.cardTitle}>🆘 Emergency Contact</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact Name:</Text>
            <Text style={styles.value}>{profile?.emergencyContact || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact Phone:</Text>
            <Text style={styles.value}>{profile?.emergencyPhone || 'N/A'}</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
          <Icon name="pencil" size={18} color="#fff" />
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  editButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8A2BE2',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 30,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 16,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nickname: {
    fontSize: 14,
    color: '#8A2BE2',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  emergencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 12,
    paddingBottomWidth: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  infoSection: {
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  editProfileButton: {
    flexDirection: 'row',
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    boxShadow: '0 4px 5px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ProfileScreen;