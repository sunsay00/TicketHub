import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, radii, spacing } from '../theme';
import type { LotteryPriceRange, SectionRowOption } from '../types';

interface LotteryOptionProps {
  option: SectionRowOption | LotteryPriceRange;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export default function LotteryOption({ option, label, selected, onSelect }: LotteryOptionProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{label}</Text>
      {'type' in option && option.type === 'VIP' && (
        <View style={styles.vipBadge}>
          <Text style={styles.vipText}>VIP</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  label: {
    color: colors.text,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  vipBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  vipText: {
    color: colors.text,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
  },
});