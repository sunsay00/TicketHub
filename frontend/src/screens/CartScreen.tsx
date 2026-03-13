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
import { useAuth } from '../context/AuthContext';
import { useLottery } from '../context/LotteryContext';
import { useOrderHistory } from '../context/OrderHistoryContext';
import type { LotteryEntry } from '../types';

interface CartScreenProps {
  navigation: {
    navigate: (screen: string, params?: { screen?: string }) => void;
    goBack?: () => void;
    reset?: (options: {
      index: number;
      routes: { name: string; params?: { screen?: string } }[];
    }) => void;
  };
}

export default function CartScreen({ navigation }: CartScreenProps) {
  const { user } = useAuth();
  const { entries, removeEntry, updateQuantity, clearEntries } = useLottery();
  const { addOrder } = useOrderHistory();

  const handleSubmitEntries = () => {
    if (entries.length === 0) return;
    if (!user?.email) {
      navigation.navigate('Login');
      return;
    }

    addOrder({ entries: [...entries], email: user.email });
    clearEntries();
    navigation.reset?.({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'Cart' } }],
    });
  };

  const getEntryLabel = (entry: LotteryEntry) => {
    if (entry.selectionType === 'section') {
      const sel = entry.selection as { section: string; row?: string };
      return sel.row && sel.row !== '-' 
        ? `${sel.section} ▯ Row ${sel.row}` 
        : sel.section;
    }
    return `Price: ${(entry.selection as { label: string }).label}`;
  };

  const handleRemove = (item: LotteryEntry) => {
    const doRemove = () => removeEntry(item.id);
    if (Platform.OS === 'web') {
      if (window.confirm(`Remove entry for ${item.event.title} - ${getEntryLabel(item)}?`)) {
        doRemove();
      }
    } else {
      Alert.alert(
        'Remove Entry',
        `Remove entry for ${item.event.title} - ${getEntryLabel(item)}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: doRemove },
        ]
      );
    }
  };

  if (entries.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎟️</Text>
          <Text style={styles.emptyText}>No entries yet</Text>
          <Text style={styles.emptySubtext}>
            Browse events and enter for a chance to win tickets
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
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {typeof navigation.goBack === 'function' && (
            <TouchableOpacity onPress={() => navigation.goBack?.()} style={styles.backBtn}>
              <Text style={styles.backText}>‹ Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.cartItemContent}>
              <Text style={styles.eventTitle}>{item.event.title}</Text>
              <Text style={styles.ticketDetails}>{getEntryLabel(item)}</Text>
              {!!item.ticketHolders?.length && (
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.cartItemRight}>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemove(item)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleSubmitEntries}
        >
          <Text style={styles.checkoutButtonText}>Submit Entries</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.screen,
  header: {
    padding: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: spacing.lg,
  },
  backText: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  list: {
    paddingHorizontal: spacing.page,
    paddingBottom: 180,
  },
  cartItem: {
    ...shared.card,
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  cartItemContent: {
    flex: 1,
  },
  eventTitle: {
    color: colors.text,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm,
  },
  ticketDetails: {
    color: colors.textDim,
    fontSize: fontSizes.bodyMd,
    marginBottom: spacing.lg,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  qtyValue: {
    color: colors.text,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    marginHorizontal: spacing.lg,
    minWidth: 24,
    textAlign: 'center',
  },
  cartItemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  removeBtn: {
    paddingVertical: spacing.sm,
  },
  removeText: {
    color: colors.primary,
    fontSize: fontSizes.bodyMd,
    fontWeight: fontWeights.bold,
  },
  footer: shared.footer,
  checkoutButton: shared.buttonPrimary,
  checkoutButtonText: shared.buttonPrimaryText,
  empty: shared.empty,
  emptyEmoji: shared.emptyEmoji,
  emptyText: shared.emptyText,
  emptySubtext: shared.emptySubtext,
  browseButton: shared.buttonPrimary,
  browseButtonText: shared.buttonPrimaryText,
});