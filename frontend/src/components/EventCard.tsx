import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors, spacing, fontSizes, fontWeights, radii } from '../theme';
import type { Event } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.page * 2 - spacing.xl) / 2;

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.venue} numberOfLines={1}>
          {event.venue}
        </Text>
        <Text style={styles.date}>{formatDate(event.date)} • {event.time}</Text>
        <Text style={styles.drawingDate}>
          Drawing: {formatDate(event.drawingDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.bodyLg,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.sm,
  },
  venue: {
    color: colors.textMuted,
    fontSize: fontSizes.body,
    marginBottom: spacing.xs,
  },
  date: {
    color: colors.textSecondary,
    fontSize: fontSizes.body,
    marginBottom: spacing.xs,
  },
  drawingDate: {
    color: colors.primaryLight,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
});