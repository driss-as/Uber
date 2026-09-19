import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RIDE_TYPES } from '../data/drivers';
import { CAR_ICONS } from '../data/carIcons';
import { POPULAR_DESTINATIONS } from '../data/destinations';

const RIDE_TYPE_ITEMS = Object.entries(RIDE_TYPES).map(([type, meta]) => ({
  id: type,
  label: meta.label,
  icon: CAR_ICONS[type],
}));

const RIDE_TYPES_BIG = RIDE_TYPE_ITEMS.slice(0, 2);
const RIDE_TYPES_SMALL = RIDE_TYPE_ITEMS.slice(2);

const DESTINATIONS_BIG = POPULAR_DESTINATIONS.slice(0, 2).map((item) => ({
  id: item.key,
  label: item.name,
  emoji: item.emoji,
  color: item.color,
  lat: item.lat,
  lng: item.lng,
}));

const DESTINATIONS_SMALL = POPULAR_DESTINATIONS.slice(2).map((item) => ({
  id: item.key,
  label: item.name,
  emoji: item.emoji,
  color: item.color,
  lat: item.lat,
  lng: item.lng,
}));

function BigTile({ label, emoji, icon, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.bigTile, color && { backgroundColor: color }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {icon ? (
        <Image source={icon} style={styles.bigIcon} resizeMode="contain" />
      ) : (
        <Text style={styles.bigEmoji}>{emoji}</Text>
      )}
      <Text style={styles.bigLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function SmallTile({ label, emoji, icon, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.smallTile, color && { backgroundColor: color }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {icon ? (
        <Image source={icon} style={styles.smallIcon} resizeMode="contain" />
      ) : (
        <Text style={styles.smallEmoji}>{emoji}</Text>
      )}
      <Text style={styles.smallLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ServicesScreen({ onSelectDestination }) {
  const goToDestination = (item) => {
    if (!item.lat || !onSelectDestination) return;
    onSelectDestination({ lat: item.lat, lng: item.lng, name: item.label, address: item.label });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Services</Text>

        <Text style={styles.sectionTitle}>Nos types de course</Text>

        <View style={styles.row}>
          {RIDE_TYPES_BIG.map((item) => (
            <BigTile key={item.id} {...item} />
          ))}
        </View>
        <View style={styles.row}>
          {RIDE_TYPES_SMALL.map((item) => (
            <SmallTile key={item.id} {...item} />
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Destinations populaires</Text>

        <View style={styles.row}>
          {DESTINATIONS_BIG.map((item) => (
            <BigTile key={item.id} {...item} onPress={() => goToDestination(item)} />
          ))}
        </View>
        <View style={styles.row}>
          {DESTINATIONS_SMALL.map((item) => (
            <SmallTile key={item.id} {...item} onPress={() => goToDestination(item)} />
          ))}
        </View>
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
    marginTop: 20,
    marginBottom: 12,
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: -16,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bigTile: {
    flex: 1,
    height: 160,
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    marginRight: 12,
    padding: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bigIcon: {
    width: 72,
    height: 72,
  },
  bigEmoji: {
    fontSize: 40,
  },
  bigLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  smallTile: {
    flex: 1,
    height: 130,
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    marginRight: 12,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallIcon: {
    width: 54,
    height: 54,
    marginTop: 8,
  },
  smallEmoji: {
    fontSize: 34,
    marginTop: 8,
  },
  smallLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});
