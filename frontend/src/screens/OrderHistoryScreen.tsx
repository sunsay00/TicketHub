import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSizes, fontWeights, radii, shared } from '../theme';
import { useOrderHistory } from '../context/OrderHistoryContext';
import { useAuth } from '../context/AuthContext';
import type { OrderHistoryScreenProps } from '../navigation/types';
import type { Order, LotteryEntry } from '../types';

export default function OrderHistoryScreen({ navigation }: OrderHistoryScreenProps) {
  const { orders, cancelOrder } = useOrderHistory();
  const { isLoggedIn, user } = useAuth();

  const userOrders = isLoggedIn && user?.email
    ? orders.filter((o) => o.email === user.email)
    : [];

  const getEntryLabel = (entry: LotteryEntry) => {
    if (entry.selectionType === 'section') {
      const sel = entry.selection as { section: string; row?: string };
      return sel.row && sel.row !== '-'
        ? `${sel.section} - Row ${sel.row}`
        : sel.section;
    }
    return `Price: ${(entry.selection as { label: string }).label}`;
  };

  const formatDrawingDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatEventDateTime = (dateStr: string, timeStr: string) => {
    const d = new Date(dateStr);
    const dateFormatted = d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${dateFormatted} at ${timeStr}`;
  };

  const getDrawingDate = (order: Order) =>
    order.entries?.[0]?.event?.drawingDate ?? order.createdAt;

  const getTotalWon = (order: Order) =>
    order.entries?.reduce((s, e) => s + (e.wonCount || 0), 0) || 0;

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Order History</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>Sign in to view order history</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (userOrders.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>
            Your submitted entries will appear here. Winners are selected randomly.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Main', { screen: 'Home' })}
          >
            <Text style={styles.browseButtonText}>Browse Events</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={userOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const totalWon = getTotalWon(item);
          const canCancel = !item.drawingRunAt;
          
          const handleCancel = () => {
            const doCancel = () => cancelOrder(item.id);
            if (Platform.OS === 'web') {
              if (window.confirm('Are you sure you want to cancel this entry? This cannot be undone.')) {
                doCancel();
              }
            } else {
              Alert.alert(
                'Cancel Entry',
                'Are you sure you want to cancel this entry? This cannot be undone.',
                [
                  { text: 'Keep', style: 'cancel' },
                  { text: 'Cancel Entry', style: 'destructive', onPress: doCancel },
                ]
              );
            }
          };

          const isDrawn = !!item.drawingRunAt;
          const hasWon = totalWon > 0;

          return (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderDate}>{formatDrawingDate(getDrawingDate(item))}</Text>
                <View style={styles.statusRow}>
                  <View style={[
                    styles.statusBadge,
                    !isDrawn && styles.statusPending,
                    isDrawn && !hasWon && styles.statusComplete,
                    hasWon && styles.statusWon,
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {!isDrawn ? 'Awaiting drawing' : hasWon ? 'Won' : 'On Waiting List'}
                    </Text>
                  </View>
                  {canCancel && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={handleCancel}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.entriesSection}>
                {item.entries?.[0] && (
                  <>
                    <Text style={styles.orderEvent}>{item.entries[0].event.title}</Text>
                    <Text style={styles.orderEventDateTime}>
                      {formatEventDateTime(item.entries[0].event.date, item.entries[0].event.time)}
                    </Text>
                  </>
                )}
                {(hasWon
                  ? item.entries?.filter((e) => (e.wonCount ?? 0) > 0)
                  : item.entries
                )?.map((entry) => (
                  <View key={entry.id} style={styles.orderRow}>
                    <Text style={styles.orderDetail}>
                      {getEntryLabel(entry)}
                      {hasWon ? ` x ${entry.wonCount}` : ` x ${entry.quantity}`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.screenWithPadding,
  header: {
    padding: spacing.xxl,
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.extrabold,
    color: colors.text,
  },
  list: shared.listBottom,
  orderCard: shared.card,
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderDate: {
    color: colors.placeholder,
    fontSize: fontSizes.bodyMd,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    marginRight: spacing.md,
  },
  statusBadgeText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  statusPending: {
    backgroundColor: colors.warning,
  },
  statusComplete: {
    backgroundColor: colors.placeholder,
  },
  statusWon: {
    backgroundColor: colors.success,
  },
  cancelBtn: {
    paddingVertical: radii.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.md,
    minWidth: 70,
  },
  cancelBtnText: {
    color: colors.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
  },
  entriesSection: {
    marginBottom: spacing.md,
  },
  orderRow: {
    marginBottom: radii.sm,
  },
  orderEvent: {
    color: colors.text,
    fontSize: 15,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xs,
  },
  orderEventDateTime: {
    color: colors.placeholder,
    fontSize: fontSizes.bodyMd,
    marginBottom: spacing.md,
  },
  orderDetail: {
    color: colors.textDim,
    fontSize: fontSizes.bodyMd,
    marginTop: spacing.xs,
  },
  empty: shared.empty,
  emptyEmoji: shared.emptyEmoji,
  emptyText: shared.emptyText,
  emptySubtext: shared.emptySubtext,
  loginButton: shared.buttonPrimary,
  loginButtonText: shared.buttonPrimaryText,
  browseButton: shared.buttonPrimary,
  browseButtonText: shared.buttonPrimaryText,
});