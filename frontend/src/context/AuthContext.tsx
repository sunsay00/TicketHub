import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

const AUTH_STORAGE_KEY = '@tickethub_user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signUp: (email: string, password: string, name: string, phone?: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          setUser(parsed);
        }
      } catch {
        // Ignore parse errors
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredUser();
  }, []);

  const saveUser = async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  };

  const login = (email: string, _password: string) => {
    const userData = {
      email,
      name: email.split('@')[0],
    };
    setUser(userData);
    saveUser(userData);
  };

  const signUp = (email: string, _password: string, name: string, phone?: string) => {
    const userData = {
      email,
      name,
      phone: phone?.trim() || undefined,
    };
    setUser(userData);
    saveUser(userData);
  };

  const logout = () => {
    setUser(null);
    saveUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, isLoggedIn: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};