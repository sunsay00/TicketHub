import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventCard from '../components/EventCard';
import { MOCK_EVENTS } from '../data/mockEvents';
import { colors, spacing, fontSizes, fontWeights, radii } from '../theme';

interface HomeScreenProps {
  navigation: {
    navigate: (screen: string, params?: { eventId?: string }) => void;
  };
}

const CONCERT_EVENTS = MOCK_EVENTS.filter((e) => e.category === 'Concert');

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return CONCERT_EVENTS;
    const q = searchQuery.toLowerCase().trim();
    return CONCERT_EVENTS.filter(
      (event) =>
        event.title.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>TicketHub</Text>
        <Text style={styles.tagline}>Find tickets to your next event</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by venue, artist, or event..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Popular Events</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <EventCard
              event={item}
              onPress={() => {
                navigation.navigate('EventDetail', { eventId: item.id })
              }}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.page,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  logo: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.extrabold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: fontSizes.bodyLg,
    color: colors.placeholder,
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.page,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: fontSizes.lg,
    marginRight: spacing.lg,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    color: colors.text,
    fontSize: fontSizes.base,
  },
  list: {
    paddingHorizontal: spacing.page,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.xl,
    width: '100%',
  },
});