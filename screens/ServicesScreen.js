import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GO_ANYWHERE_BIG = [
  { id: 'course', label: 'Course', emoji: '🚗' },
  { id: 'reserver', label: 'Réserver', emoji: '📅' },
];

const GO_ANYWHERE_SMALL = [
  { id: 'location', label: 'Location', emoji: '🔑', promo: true },
  { id: 'seniors', label: 'Seniors', emoji: '🚶' },
  { id: 'teens', label: 'Teens', emoji: '🎒' },
];

const DELIVER_BIG = [
  { id: 'repas', label: 'Repas', emoji: '🥗' },
  { id: 'courses', label: 'Courses', emoji: '🛒' },
];

const DELIVER_SMALL_ROW1 = [
  { id: 'alcool', label: 'Alcool', emoji: '🍷' },
  { id: 'electronique', label: 'Électronique', emoji: '🖱️' },
  { id: 'sante', label: 'Santé', emoji: '💊' },
  { id: 'epicerie', label: 'Épicerie', emoji: '🥖' },
];

const DELIVER_SMALL_ROW2 = [
  { id: 'boutique', label: 'Boutique', emoji: '📚' },
  { id: 'bebe', label: 'Bébé', emoji: '🍼' },
  { id: 'animaux', label: 'Animaux', emoji: '🐾' },
  { id: 'hygiene', label: 'Hygiène', emoji: '💄' },
];

function BigTile({ label, emoji, promo }) {
  return (
    <TouchableOpacity style={styles.bigTile} activeOpacity={0.7}>
      {promo ? (
        <View style={styles.promoBadge}>
          <Text style={styles.promoBadgeText}>Promo</Text>
        </View>
      ) : null}
      <Text style={styles.bigEmoji}>{emoji}</Text>
      <Text style={styles.bigLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function SmallTile({ label, emoji, promo }) {
  return (
    <TouchableOpacity style={styles.smallTile} activeOpacity={0.7}>
      {promo ? (
        <View style={styles.promoBadge}>
          <Text style={styles.promoBadgeText}>Promo</Text>
        </View>
      ) : null}
      <Text style={styles.smallEmoji}>{emoji}</Text>
      <Text style={styles.smallLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ServicesScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Services</Text>

        <Text style={styles.sectionTitle}>Allez n'importe où</Text>

        <View style={styles.row}>
          {GO_ANYWHERE_BIG.map((item) => (
            <BigTile key={item.id} {...item} />
          ))}
        </View>
        <View style={styles.row}>
          {GO_ANYWHERE_SMALL.map((item) => (
            <SmallTile key={item.id} {...item} />
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Faites-vous livrer ce que vous voulez</Text>

        <View style={styles.row}>
          {DELIVER_BIG.map((item) => (
            <BigTile key={item.id} {...item} />
          ))}
        </View>
        <View style={styles.row}>
          {DELIVER_SMALL_ROW1.map((item) => (
            <SmallTile key={item.id} {...item} />
          ))}
        </View>
        <View style={styles.row}>
          {DELIVER_SMALL_ROW2.map((item) => (
            <SmallTile key={item.id} {...item} />
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
  smallEmoji: {
    fontSize: 34,
    marginTop: 8,
  },
  // smallEmoji matches forYouEmoji size in HomeScreen for a consistent icon scale
  smallLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  promoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#e11900',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  promoBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
