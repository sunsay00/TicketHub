import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSizes, fontWeights, radii, shared, typography } from '../theme';
import { getEventById, LOTTERY_SECTION_ROWS, LOTTERY_PRICE_RANGES } from '../data/mockEvents';
import LotteryOption from '../components/LotteryOption';
import SeatMap from '../components/SeatMap';
import { useAuth } from '../context/AuthContext';
import { useLottery } from '../context/LotteryContext';
import type { EventDetailScreenProps } from '../navigation/types';
import type { LotteryPriceRange, SectionRowOption } from '../types';

export default function EventDetailScreen({ route, navigation }: EventDetailScreenProps) {
  const { eventId } = route.params;
  const event = getEventById(eventId);
  const { isLoggedIn } = useAuth();
  const { addEntry } = useLottery();

  const [mode, setMode] = useState<'section' | 'priceRange'>('section');
  const [selectedSectionRows, setSelectedSectionRows] = useState<SectionRowOption[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<LotteryPriceRange[]>([]);
  const [step, setStep] = useState<'select' | 'tickets' | 'details'>('select');
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketHolderInputs, setTicketHolderInputs] = useState<string[]>(['']);
  const [showSeatMap, setShowSeatMap] = useState(false);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleEnterClick = () => {
    if (selectedSectionRows.length === 0 && selectedPriceRanges.length === 0) {
      Alert.alert('Select Option', 'Please select at least one option.');
      return;
    }
    setStep('tickets');
    setTicketCount(1);
    setTicketHolderInputs(['']);
  };

  const handleTicketsContinue = () => {
    setStep('details');
    setTicketHolderInputs(Array(ticketCount).fill(''));
  };

  const handleDetailsSubmit = () => {
    const allFilled = ticketHolderInputs.every((v) => v.trim().length > 0);
    if (!allFilled) {
      Alert.alert('Required', 'Please enter a name or phone number for each ticket.');
      return;
    }

    const ticketHolders = ticketHolderInputs.map((v) => ({ nameOrPhone: v.trim() }));

    selectedSectionRows.forEach((opt) => {
      addEntry(
        event,
        'section',
        { section: opt.section, row: opt.row },
        ticketCount,
        ticketHolders
      );
    });

    selectedPriceRanges.forEach((range) => {
      addEntry(
        event,
        'priceRange',
        { minPrice: range.min, maxPrice: range.max, label: range.label },
        ticketCount,
        ticketHolders
      );
    });

    setSelectedSectionRows([]);
    setSelectedPriceRanges([]);
    setStep('select');
    setTicketCount(1);
    setTicketHolderInputs(['']);

    navigation.navigate('Cart');
  };

  const handleBack = () => {
    if (step === 'tickets') {
      setStep('select');
    } else if (step === 'details') {
      setStep('tickets');
    }
  };

  const handleSelectSectionRow = (option: SectionRowOption) => {
    setSelectedSectionRows((prev) =>
      prev.some((s) => s.id === option.id)
        ? prev.filter((s) => s.id !== option.id)
        : [...prev, option]
    );
  };

  const handleSelectPriceRange = (range: LotteryPriceRange) => {
    setSelectedPriceRanges((prev) =>
      prev.some((r) => r.id === range.id)
        ? prev.filter((r) => r.id !== range.id)
        : [...prev, range]
    );
  };

  const handleSeatMapSectionPress = (section: string) => {
    const optionsInSection = LOTTERY_SECTION_ROWS.filter((opt) => opt.section === section);
    const allSelected = optionsInSection.every((opt) =>
      selectedSectionRows.some((s) => s.id === opt.id)
    );

    if (allSelected) {
      setSelectedSectionRows((prev) =>
        prev.filter((s) => !optionsInSection.some((opt) => opt.id === s.id))
      );
    } else {
      setSelectedSectionRows((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const toAdd = optionsInSection.filter((opt) => !existingIds.has(opt.id));
        return [...prev, ...toAdd];
      });
    }
  };

  const selectedSectionNames = new Set(
    selectedSectionRows.map((s) => s.section)
  );

  const selectedCount = selectedSectionRows.length + selectedPriceRanges.length;
  const hasSelection = selectedCount > 0;
  const totalEntries = selectedCount * ticketCount;

  const renderSelectStep = () => {
    if (!isLoggedIn) {
      return (
        <View style={styles.lotterySection}>
          <Text style={styles.sectionSubtitle}>
            Sign in to enter the lottery for this event.
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <View style={styles.lotterySection}>
          <Text style={styles.sectionSubtitle}>
            Select one or more options from either tab. Winners are chosen randomly.
          </Text>

          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'section' && styles.modeBtnActive]}
              onPress={() => setMode('section')}
            >
              <Text style={[styles.modeBtnText, mode === 'section' && styles.modeBtnTextActive]}>
                By Section
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'priceRange' && styles.modeBtnActive]}
              onPress={() => setMode('priceRange')}
            >
              <Text style={[styles.modeBtnText, mode === 'priceRange' && styles.modeBtnTextActive]}>
                By Price Range
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'section' && (
            <>
              {LOTTERY_SECTION_ROWS.map((option) => (
                <LotteryOption
                  key={option.id}
                  option={option}
                  label={option.row === '-' ? option.section : `${option.section} - Row ${option.row}`}
                  selected={selectedSectionRows.some((s) => s.id === option.id)}
                  onSelect={() => handleSelectSectionRow(option)}
                />
              ))}
            </>
          )}

          {mode === 'priceRange' && (
            <>
              {LOTTERY_PRICE_RANGES.map((range) => (
                <LotteryOption
                  key={range.id}
                  option={range}
                  label={range.label}
                  selected={selectedPriceRanges.some((r) => r.id === range.id)}
                  onSelect={() => handleSelectPriceRange(range)}
                />
              ))}
            </>
          )}
        </View>
      </>
    );
  };

  const renderTicketsStep = () => (
    <View style={styles.stepSection}>
      <Text style={styles.sectionTitle}>Number of tickets</Text>
      <Text style={styles.sectionSubtitle}>
        How many tickets per option? ({selectedCount} option{selectedCount !== 1 ? 's' : ''} selected = {totalEntries} total entries)
      </Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setTicketCount(Math.max(1, ticketCount - 1))}
        >
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{ticketCount}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setTicketCount(Math.min(10, ticketCount + 1))}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDetailsStep = () => (
    <View style={styles.stepSection}>
      <Text style={styles.sectionTitle}>Ticket holder info</Text>
      <Text style={styles.sectionSubtitle}>Enter name or phone number for each ticket</Text>
      {ticketHolderInputs.map((value, idx) => (
        <View key={idx} style={styles.ticketInputRow}>
          <Text style={styles.ticketLabel}>Ticket {idx + 1}</Text>
          <View style={styles.ticketInputWrapper}>
            <TextInput
              style={styles.ticketInput}
              placeholder={idx === 0 ? "Or enter name or phone number" : "Name or phone number"}
              placeholderTextColor={colors.placeholder}
              value={value}
              onChangeText={(text) => {
                const next = [...ticketHolderInputs];
                next[idx] = text;
                setTicketHolderInputs(next);
              }}
            />
            <TouchableOpacity
              style={[styles.selfChip, value === 'Self' && styles.selfChipActive]}
              onPress={() => {
                const next = [...ticketHolderInputs];
                next[idx] = 'Self';
                setTicketHolderInputs(next);
              }}
            >
              <Text style={[styles.selfChipText, value === 'Self' && styles.selfChipTextActive]}>
                Self
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const getFooterButton = () => {
    if (!isLoggedIn) return null;

    if (step === 'select') {
      return (
        <TouchableOpacity
          style={[styles.addButton, !hasSelection && styles.addButtonDisabled]}
          onPress={handleEnterClick}
          disabled={!hasSelection}
        >
          <Text style={styles.addButtonText}>
            {hasSelection ? 'Enter' : 'Select at least one option above'}
          </Text>
        </TouchableOpacity>
      );
    }
    if (step === 'tickets') {
      return (
        <TouchableOpacity style={styles.addButton} onPress={handleTicketsContinue}>
          <Text style={styles.addButtonText}>Continue</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.addButton} onPress={handleDetailsSubmit}>
        <Text style={styles.addButtonText}>Submit</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <View>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.venue}>{event.venue}</Text>
              <Text style={styles.city}>{event.city}</Text>
              <Text style={styles.date}>
                {formatDate(event.date)} at {event.time}
              </Text>
              <TouchableOpacity
                style={styles.seatMapButton}
                onPress={() => setShowSeatMap(true)}
              >
                <Text style={styles.seatMapButtonText}>View Seat Map</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            visible={showSeatMap}
            transparent
            animationType="fade"
            onRequestClose={() => setShowSeatMap(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowSeatMap(false)}
            >
              <Pressable 
                style={styles.seatMapModalContent} 
                onPress={(e) => e.stopPropagation()}
              >
                <Text style={styles.seatMapModalTitle}>Venue Seat Map</Text>
                <Text style={styles.seatMapModalVenue}>{event.venue}</Text>
                <SeatMap
                  selectedSections={selectedSectionNames}
                  onSectionPress={handleSeatMapSectionPress}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowSeatMap(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>

          {step !== 'select' && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}

          {step === 'select' && renderSelectStep()}
          {step === 'tickets' && renderTicketsStep()}
          {step === 'details' && renderDetailsStep()}

          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.footer}>{getFooterButton()}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: shared.screen,
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.text,
    fontSize: fontSizes.base,
  },
  keyboard: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: shared.pageBottom,
  hero: {
    padding: spacing.xxl,
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.extrabold,
    marginBottom: spacing.md,
  },
  venue: {
    color: colors.text,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.sm,
  },
  city: {
    color: colors.textMuted,
    fontSize: fontSizes.bodyLg,
    marginBottom: spacing.md,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: fontWeights.bold,
  },
  seatMapButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  seatMapButtonText: typography.accent,
  modalOverlay: shared.modalOverlay,
  seatMapModalContent: {
    ...shared.modalContent,
    maxWidth: 360,
  },
  seatMapModalTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  seatMapModalVenue: {
    ...typography.accent,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: 32,
    borderRadius: radii.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  closeButtonText: shared.buttonPrimaryText,
  lotterySection: {
    paddingHorizontal: spacing.page,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: fontSizes.bodyMd,
    marginBottom: spacing.xl,
  },
  signInButton: shared.buttonDestructive,
  signInButtonText: shared.buttonPrimaryText,
  modeToggle: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.sm,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderRadius: radii.lg,
  },
  modeBtnActive: {
    backgroundColor: colors.primary,
  },
  modeBtnText: {
    color: colors.placeholder,
    fontSize: fontSizes.bodyLg,
    fontWeight: fontWeights.bold,
  },
  modeBtnTextActive: {
    color: colors.text,
  },
  stepSection: shared.cardSection,
  backButton: {
    paddingHorizontal: spacing.page,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  backButtonText: {
    color: colors.placeholder,
    fontSize: fontSizes.base,
  },
  ticketInputRow: {
    marginBottom: spacing.xl,
  },
  ticketLabel: {
    ...typography.label,
    marginBottom: radii.sm,
  },
  ticketInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selfChip: {
    marginLeft: spacing.lg,
    paddingHorizontal: 14,
    paddingVertical: radii.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selfChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selfChipText: {
    color: colors.textDim,
    fontSize: fontSizes.bodyLg,
    fontWeight: fontWeights.bold,
  },
  selfChipTextActive: {
    color: colors.text,
  },
  ticketInput: shared.inputDark,
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },
  quantityValue: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    marginHorizontal: spacing.xxxl,
    minWidth: 30,
    textAlign: 'center',
  },
  spacer: {
    height: spacing.section,
  },
  footer: shared.footer,
  addButton: shared.buttonPrimary,
  addButtonDisabled: shared.buttonDisabled,
  addButtonText: shared.buttonPrimaryText,
});