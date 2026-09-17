import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RIDE_TYPES } from '../data/drivers';
import { CAR_ICONS } from '../data/carIcons';
import { getRecentSearches } from '../data/recentSearches';

const TABS = [
  { key: 'uber', label: 'Uber', emoji: '🚗', active: true },
  { key: 'eats', label: 'Uber Eats', emoji: '🥗', active: false },
  { key: 'courses', label: 'Courses', emoji: '🏪', active: false },
];

// Affichées tant que l'utilisateur n'a pas encore recherché de destination
const DEFAULT_RECENTS = [
  {
    title: 'Fourrière Municipale de Paris',
    subtitle: '39 Rue de Dantzig, Paris',
  },
  {
    title: 'Renault Paris Bastille',
    subtitle: '9 Bd Richard Lenoir, Paris',
  },
];

const FOR_YOU = Object.entries(RIDE_TYPES).map(([type, meta]) => ({
  key: type,
  label: meta.label,
}));

const POPULAR_DESTINATIONS = [
  {
    key: 'cdg',
    name: 'Aéroport Charles de Gaulle',
    category: 'Vols internationaux',
    time: '45 min',
    color: '#dbe7f5',
    emoji: '✈️',
  },
  {
    key: 'orly',
    name: "Aéroport d'Orly",
    category: 'Vols nationaux',
    time: '30 min',
    color: '#fde8d7',
    emoji: '🛫',
  },
  {
    key: 'gare-du-nord',
    name: 'Gare du Nord',
    category: 'Eurostar, Thalys',
    time: '15 min',
    color: '#e2dbf5',
    emoji: '🚄',
  },
  {
    key: 'tour-eiffel',
    name: 'Tour Eiffel',
    category: 'Monument',
    time: '20 min',
    color: '#dff0e4',
    emoji: '🗼',
  },
  {
    key: 'disneyland',
    name: 'Disneyland Paris',
    category: 'Parc à thème',
    time: '40 min',
    color: '#fbe0ea',
    emoji: '🎢',
  },
  {
    key: 'la-defense',
    name: 'La Défense',
    category: "Quartier d'affaires",
    time: '25 min',
    color: '#e8e8e8',
    emoji: '🏢',
  },
];

export default function HomeScreen({ onPressSearch }) {
  const [recents, setRecents] = useState(DEFAULT_RECENTS);

  useEffect(() => {
    getRecentSearches().then((stored) => {
      if (stored.length > 0) setRecents(stored);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab.key} style={styles.tabItem} activeOpacity={0.7}>
            <View style={styles.tabLabelRow}>
              <Text style={styles.tabEmoji}>{tab.emoji}</Text>
              <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </View>
            {tab.active ? <View style={styles.tabUnderline} /> : null}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.searchBar} activeOpacity={0.7} onPress={onPressSearch}>
            <Ionicons name="search" size={18} color="#000" />
            <Text style={styles.searchPlaceholder}>Où allez-vous ?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.laterButton} activeOpacity={0.7}>
            <Ionicons name="calendar-outline" size={16} color="#000" />
            <Text style={styles.laterText}>Plus tard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentsCard}>
          {recents.map((item, index) => (
            <View key={item.title}>
              <TouchableOpacity style={styles.recentRow} activeOpacity={0.7}>
                <View style={styles.recentIcon}>
                  <Ionicons name="time-outline" size={18} color="#000" />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle}>{item.title}</Text>
                  <Text style={styles.recentSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9a9a9a" />
              </TouchableOpacity>
              {index < recents.length - 1 ? <View style={styles.recentDivider} /> : null}
            </View>
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Nos types de course</Text>
          <View style={styles.chevronCircle}>
            <Ionicons name="chevron-forward" size={14} color="#000" />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.forYouRow}
        >
          {FOR_YOU.map((item) => (
            <TouchableOpacity key={item.key} style={styles.forYouItem} activeOpacity={0.7}>
              <View style={styles.forYouCircle}>
                <Image source={CAR_ICONS[item.key]} style={styles.forYouCarImage} resizeMode="contain" />
              </View>
              <Text style={styles.forYouLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Destinations populaires</Text>
          <View style={styles.chevronCircle}>
            <Ionicons name="chevron-forward" size={14} color="#000" />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eatsRow}
        >
          {POPULAR_DESTINATIONS.map((item) => (
            <TouchableOpacity key={item.key} style={styles.eatsCard} activeOpacity={0.7}>
              <View style={[styles.eatsImage, { backgroundColor: item.color }]}>
                <Text style={styles.eatsEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.eatsName}>{item.name}</Text>
              <Text style={styles.eatsCategory}>{item.category}</Text>
              <View style={styles.eatsRatingRow}>
                <Ionicons name="time-outline" size={13} color="#6b6b6b" />
                <Text style={styles.eatsReviews}>{item.time} en voiture</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabItem: {
    marginRight: 24,
    paddingBottom: 10,
  },
  tabLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 19,
    fontWeight: '600',
    color: '#9a9a9a',
  },
  tabLabelActive: {
    color: '#000',
  },
  tabUnderline: {
    marginTop: 8,
    height: 2,
    width: '100%',
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 10,
  },
  laterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  laterText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  recentsCard: {
    marginTop: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  recentSubtitle: {
    fontSize: 13,
    color: '#6b6b6b',
    marginTop: 2,
  },
  recentDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e5e5',
    marginLeft: 62,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginRight: 8,
  },
  chevronCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forYouRow: {
    paddingHorizontal: 16,
  },
  forYouItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  forYouCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forYouCarImage: {
    width: 56,
    height: 56,
  },
  forYouLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
    textAlign: 'center',
  },
  eatsRow: {
    paddingHorizontal: 16,
  },
  eatsCard: {
    width: 220,
    marginRight: 14,
  },
  eatsImage: {
    height: 130,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  eatsEmoji: {
    fontSize: 48,
  },
  eatsName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginTop: 8,
  },
  eatsCategory: {
    fontSize: 13,
    color: '#6b6b6b',
    marginTop: 2,
  },
  eatsRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  eatsReviews: {
    fontSize: 13,
    color: '#6b6b6b',
    marginLeft: 4,
  },
});
