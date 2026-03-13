import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSizes, fontWeights, radii, shared } from '../theme';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { useOrderHistory } from '../context/OrderHistoryContext';
import { useAuth } from '../context/AuthContext';
import type { LotteryEntry } from '../types';

interface WinningTicket {
  id: string;
  orderId: string;
  entry: LotteryEntry;
  wonCount: number;
}

export default function TicketsScreen() {
  const navigation = useNavigation();
  const { orders, releaseAllTickets } = useOrderHistory();
  const { isLoggedIn, user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<WinningTicket | null>(null);

  const tickets: WinningTicket[] = [];
  if (isLoggedIn && user?.email) {
    orders
      .filter((o) => o.email === user.email)
      .forEach((order) => {
        order.entries?.forEach((entry) => {
          const won = entry.wonCount || 0;
          if (won > 0) {
            tickets.push({
              id: `${order.id}-${entry.id}`,
              orderId: order.id,
              entry,
              wonCount: won,
            });
          }
        });
      });
  }

  const getSectionRowSeat = (entry: LotteryEntry, ticketIndex?: number) => {
    if (entry.selectionType === 'section') {
      const sel = entry.selection as { section: string; row?: string };
      const section = sel.section;
      const row = sel.row && sel.row !== '-' ? sel.row : '-';
      const seat = entry.seatAssignments?.[ticketIndex ?? 0] ?? '-';
      return { section, row, seat };
    }
    const label = (entry.selection as { label: string }).label;
    const seat = entry.seatAssignments?.[ticketIndex ?? 0] ?? '-';
    return { section: `Price: ${label}`, row: '-', seat };
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎫</Text>
          <Text style={styles.emptyText}>Sign in to view your tickets</Text>
          <Text style={styles.emptySubtext}>Winning entries become tickets here</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (tickets.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎫</Text>
          <Text style={styles.emptyText}>No winning tickets yet</Text>
          <Text style={styles.emptySubtext}>
            Enter lotteries and check back after drawings. Winners appear here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const { section, row } = getSectionRowSeat(item.entry);
          const seats = item.entry.seatAssignments ?? [];
          const seatDisplay = seats.length > 1 ? seats.join(', ') : seats[0] ?? '-';

          const handleRelease = () => {
            const doRelease = () => {
              releaseAllTickets(item.orderId, item.entry.id);
            };

            if (Platform.OS === 'web') {
              if (window.confirm('Release this ticket? It will be returned to the pool.')) {
                doRelease();
              }
            } else {
              Alert.alert('Release Ticket', 'Release this ticket? It will be returned to the pool.', [
                { text: 'Keep', style: 'cancel' },
                { text: 'Release', style: 'destructive', onPress: doRelease },
              ]);
            }
          };

          return (
            <View style={styles.ticketCard}>
              <View style={styles.ticketCardRow}>
                <TouchableOpacity
                  style={styles.ticketCardContent}
                  onPress={() => setSelectedTicket(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.eventTitle}>{item.entry.event.title}</Text>
                  <Text style={styles.venue}>{item.entry.event.venue}</Text>
                  <Text style={styles.date}>
                    {formatDate(item.entry.event.date)} at {item.entry.event.time}
                  </Text>
                  <View style={styles.seatInfo}>
                    <Text style={styles.seatInfoLabel}>Section </Text>
                    <Text style={styles.seatInfoValue}>{section}</Text>
                    <Text style={styles.seatInfoLabel}> • Row </Text>
                    <Text style={styles.seatInfoValue}>{row}</Text>
                    <Text style={styles.seatInfoLabel}> • Seat{item.entry.seatAssignments && item.entry.seatAssignments.length > 1 ? 's' : ''} </Text>
                    <Text style={styles.seatInfoValue}>{seatDisplay}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.releaseButton} onPress={handleRelease}>
                  <Text style={styles.releaseButtonText}>Release</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal
        visible={selectedTicket !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTicket(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedTicket(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {selectedTicket && (
              <>
                <Text style={styles.modalTitle}>{selectedTicket.entry.event.title}</Text>
                {(() => {
                  const { section, row } = getSectionRowSeat(selectedTicket.entry);
                  const seats = selectedTicket.entry.seatAssignments ?? [];
                  const seatDisplay = seats.length > 1 ? seats.join(', ') : seats[0] ?? '-';
                  return (
                    <Text style={styles.modalSubtitle}>
                      Section {section} • Row {row} • Seat{seats.length > 1 ? 's' : ''} {seatDisplay}
                    </Text>
                  );
                })()}
                <ScrollView
                  style={styles.qrScrollView}
                  contentContainerStyle={styles.qrScrollContent}
                  showsVerticalScrollIndicator={true}
                >
                  {Array.from({ length: selectedTicket.wonCount }, (_, i) => {
                    const { seat } = getSectionRowSeat(selectedTicket.entry, i);
                    return (
                      <View key={i} style={styles.qrItem}>
                        <Text style={styles.qrLabel}>
                          {selectedTicket.wonCount > 1
                            ? `Ticket ${i + 1} of ${selectedTicket.wonCount} • Seat ${seat}`
                            : `Seat ${seat}`}
                        </Text>
                        <View style={styles.qrContainer}>
                          <QRCode
                            value={`${selectedTicket.id}-${i}`}
                            size={200}
                            backgroundColor="#fff"
                            color="#000"
                          />
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
                <Text style={styles.modalHint}>Scan at venue for entry</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedTicket(null)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.screenWithPadding,
  list: shared.listBottom,
  ticketCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  ticketCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  ticketCardContent: {
    flex: 1,
  },
  eventTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm,
  },
  venue: {
    color: colors.textDim,
    fontSize: fontSizes.bodyLg,
    marginBottom: spacing.xs,
  },
  date: {
    color: colors.placeholder,
    fontSize: fontSizes.bodyMd,
    marginBottom: spacing.md,
  },
  seatInfo: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    color: colors.textDim,
    fontSize: fontSizes.bodyMd,
  },
  seatInfoLabel: {
    color: colors.placeholder,
  },
  seatInfoValue: {
    color: colors.text,
    fontWeight: fontWeights.bold,
  },
  empty: shared.empty,
  emptyEmoji: shared.emptyEmoji,
  emptyText: shared.emptyText,
  emptySubtext: shared.emptySubtext,
  loginButton: shared.buttonPrimary,
  loginButtonText: shared.buttonPrimaryText,
  modalOverlay: shared.modalOverlay,
  modalContent: {
    ...shared.modalContent,
    alignItems: 'center',
    maxWidth: 320,
  },
  modalTitle: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: colors.primary,
    fontSize: fontSizes.bodyLg,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xl,
  },
  qrScrollView: {
    maxHeight: 300,
    marginBottom: spacing.xl,
  },
  qrScrollContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  qrItem: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  qrLabel: {
    color: colors.textDim,
    fontSize: fontSizes.bodyMd,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.md,
  },
  qrContainer: {
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
  },
  releaseButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.md,
    marginLeft: spacing.lg,
  },
  releaseButtonText: {
    color: colors.primary,
    fontSize: fontSizes.bodyMd,
    fontWeight: fontWeights.bold,
  },
  modalHint: {
    color: colors.placeholder,
    fontSize: fontSizes.bodyMd,
    marginBottom: spacing.xxl,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: 32,
    borderRadius: radii.xl,
  },
  closeButtonText: shared.buttonPrimaryText,
});