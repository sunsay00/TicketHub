import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Main:
    | { screen?: 'Home' | 'Cart' | 'Tickets' | 'Profile'; state?: { routes: { name: string }[]; index: number } }
    | undefined;
  EventDetail: { eventId: string };
  Cart: undefined;
  Login: undefined;
  SignUp: undefined;
  OrderHistory: undefined;
};

export type EventDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
export type OrderHistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'OrderHistory'>;