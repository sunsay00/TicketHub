import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSizes, fontWeights, radii, shared } from '../theme';
import { useAuth } from '../context/AuthContext';

interface ProfileScreenProps {
  navigation: {
    navigate: (screen: string, params?: { screen?: string }) => void;
  };
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, logout, isLoggedIn } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>👤</Text>
          <Text style={styles.emptyText}>Sign in to view your profile</Text>
          <Text style={styles.emptySubtext}>Manage your account</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user!.name?.charAt(0)?.toUpperCase() || user!.email?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.userName}>{user!.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user!.email}</Text>
          {user!.phone ? (
            <Text style={styles.userPhone}>{user!.phone}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.screen,
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: spacing.section,
  },
  header: {
    padding: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.extrabold,
    color: colors.text,
  },
  empty: shared.empty,
  emptyEmoji: shared.emptyEmoji,
  emptyText: shared.emptyText,
  emptySubtext: shared.emptySubtext,
  loginButton: shared.buttonPrimary,
  loginButtonText: shared.buttonPrimaryText,
  cancelButton: {
    ...shared.buttonSecondary,
    marginTop: spacing.md,
    alignSelf: 'center',
  },
  cancelButtonText: shared.buttonSecondaryText,
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.page,
    padding: spacing.xxxl,
    borderRadius: radii.xxl,
    alignItems: 'center',
    marginBottom: spacing.xxxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radii.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarText: {
    color: colors.text,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.extrabold,
  },
  userName: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm,
  },
  userEmail: {
    color: colors.placeholder,
    fontSize: fontSizes.bodyLg,
  },
  userPhone: {
    color: colors.placeholder,
    fontSize: fontSizes.bodyLg,
    marginTop: spacing.sm,
  },
  logoutButton: {
    ...shared.buttonOutline,
    marginHorizontal: spacing.page,
    marginTop: spacing.xxxl,
  },
  logoutText: shared.buttonOutlineText,
});