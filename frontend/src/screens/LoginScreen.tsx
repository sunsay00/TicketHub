import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontWeights, shared, typography } from '../theme';
import { useAuth } from '../context/AuthContext';
import type { LoginScreenProps } from '../navigation/types';

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Password Required', 'Please enter your password.');
      return;
    }
    
    login(email.trim(), password);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'Home' } }],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to manage your entries</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate('Main', { screen: 'Home' })}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.switchLinkText}>
              Don't have an account? <Text style={styles.switchLinkHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.demoHint}>
            Demo: Enter any email and password to sign in
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.screen,
  keyboard: { flex: 1 },
  header: {
    padding: spacing.xxl,
    paddingBottom: 32,
  },
  title: typography.h1,
  subtitle: {
    ...typography.caption,
    marginTop: spacing.md,
  },
  form: shared.page,
  input: {
    ...shared.input,
    marginBottom: spacing.lg,
  },
  loginButton: {
    ...shared.buttonPrimary,
    marginTop: spacing.md,
  },
  loginButtonText: shared.buttonPrimaryText,
  cancelButton: {
    ...shared.buttonSecondary,
    marginTop: spacing.lg,
  },
  cancelButtonText: shared.buttonSecondaryText,
  switchLink: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  switchLinkText: typography.caption,
  switchLinkHighlight: {
    color: colors.primary,
    fontWeight: fontWeights.bold,
  },
  demoHint: {
    ...typography.captionSm,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});