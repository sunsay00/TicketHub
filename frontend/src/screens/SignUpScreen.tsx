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
import type { SignUpScreenProps } from '../navigation/types';

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignUp = () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Password Required', 'Please enter your password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords Don't Match", 'Please make sure your passwords match.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }

    signUp(email.trim(), password, name.trim(), phone.trim() || undefined);
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to start entering lotteries</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={colors.placeholder}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
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
            placeholder="Phone Number"
            placeholderTextColor={colors.placeholder}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.placeholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate('Main', { screen: 'Home' })}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.switchLinkText}>
              Already have an account?{' '}
              <Text style={styles.switchLinkHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.demoHint}>
            Demo: Enter any details to create an account
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
  signUpButton: {
    ...shared.buttonPrimary,
    marginTop: spacing.md,
  },
  signUpButtonText: shared.buttonPrimaryText,
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