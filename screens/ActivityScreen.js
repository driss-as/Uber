import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PAST_LIST = [
  {
    key: 'burger-king',
    title: 'Burger King',
    subtitle: '9 mai • 19:02',
    meta: '€31.63 • 1 article',
    emoji: '🍔',
    color: '#8b1a1a',
    action: 'Visitez',
    actionIcon: 'storefront-outline',
  },
  {
    key: 'fourriere',
    title: 'Fourrière Municipale de Paris',
    subtitle: '',
    meta: '',
    emoji: '🚗',
    color: '#f0f0f0',
    action: 'Réserver',
    actionIcon: 'repeat',
  },
];

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Activité</Text>

        <Text style={styles.sectionTitle}>À venir</Text>

        <View style={styles.upcomingCard}>
          <View style={styles.upcomingText}>
            <Text style={styles.upcomingTitle}>Vous n'avez aucune course planifiée.</Text>
            <Text style={styles.upcomingLink}>Réservez votre course →</Text>
          </View>
          <Text style={styles.upcomingEmoji}>📅</Text>
        </View>

        <View style={styles.pastHeaderRow}>
          <Text style={styles.sectionTitle}>Passées</Text>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.tripCard}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.routeLine} />
            <View style={styles.routeStart} />
            <View style={styles.routeEnd} />
          </View>
          <Text style={styles.tripTitle}>Renault Paris Bastille</Text>
          <Text style={styles.tripSubtitle}>22 mai • 17:16</Text>
          <Text style={styles.tripSubtitle}>22,94€</Text>

          <View style={styles.tripActions}>
            <TouchableOpacity style={styles.pillButton} activeOpacity={0.7}>
              <Ionicons name="star-outline" size={16} color="#000" />
              <Text style={styles.pillButtonText}>Note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pillButton} activeOpacity={0.7}>
              <Ionicons name="repeat" size={16} color="#000" />
              <Text style={styles.pillButtonText}>Réserver</Text>
            </TouchableOpacity>
          </View>
        </View>

        {PAST_LIST.map((item, index) => (
          <View key={item.key}>
            <View style={styles.listRow}>
              <View style={[styles.listThumb, { backgroundColor: item.color }]}>
                <Text style={styles.listEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.listSubtitle}>{item.subtitle}</Text> : null}
                {item.meta ? <Text style={styles.listSubtitle}>{item.meta}</Text> : null}
              </View>
              <TouchableOpacity style={styles.pillButtonSmall} activeOpacity={0.7}>
                <Ionicons name={item.actionIcon} size={15} color="#000" />
                <Text style={styles.pillButtonText}>{item.action}</Text>
              </TouchableOpacity>
            </View>
            {index < PAST_LIST.length - 1 ? <View style={styles.listDivider} /> : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  pageTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#000',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 24,
    marginBottom: 12,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 14,
    padding: 16,
  },
  upcomingText: {
    flex: 1,
    marginRight: 12,
  },
  upcomingTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#000',
    lineHeight: 24,
  },
  upcomingLink: {
    fontSize: 14,
    color: '#6b6b6b',
    marginTop: 8,
  },
  upcomingEmoji: {
    fontSize: 40,
  },
  pastHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  mapPlaceholder: {
    height: 150,
    borderRadius: 10,
    backgroundColor: '#e9edf3',
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 14,
  },
  routeLine: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 72,
    height: 3,
    backgroundColor: '#000',
    transform: [{ rotate: '-8deg' }],
  },
  routeStart: {
    position: 'absolute',
    left: 18,
    top: 100,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  routeEnd: {
    position: 'absolute',
    right: 18,
    top: 42,
    width: 12,
    height: 12,
    backgroundColor: '#000',
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  tripSubtitle: {
    fontSize: 14,
    color: '#6b6b6b',
    marginTop: 4,
  },
  tripActions: {
    flexDirection: 'row',
    marginTop: 14,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  pillButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pillButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginLeft: 6,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  listThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  listEmoji: {
    fontSize: 26,
  },
  listInfo: {
    flex: 1,
    marginRight: 10,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  listSubtitle: {
    fontSize: 13,
    color: '#6b6b6b',
    marginTop: 2,
  },
  listDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e5e5',
  },
});
