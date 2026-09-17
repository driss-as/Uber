import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const QUICK_LINKS = [
  { key: 'aide', label: 'Aide', icon: 'help-circle-outline' },
  { key: 'wallet', label: 'Wallet', icon: 'wallet-outline' },
  { key: 'securite', label: 'Sécurité', icon: 'shield-outline' },
  { key: 'messages', label: 'Messages', icon: 'mail-outline', dot: true },
];

const PROMO_CARDS = [
  {
    key: 'uber-one',
    title: 'Essayez Uber One gratuitement',
    subtitle: 'Bénéficiez de 10 % en crédit Uber One sur les trajets et plus encore',
    emoji: '🚗',
  },
  {
    key: 'invite',
    title: 'Invitez vos amis à Uber',
    subtitle: 'Profitez de -50% sur 5 trajets avec Uber',
    emoji: '🧑‍💼',
  },
  {
    key: 'teens',
    title: 'Uber pour ados',
    subtitle: 'Invitez votre adolescent à créer son propre compte',
    emoji: '🎉',
  },
];

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>Driss AS</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DA</Text>
          </View>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#000" />
          <Text style={styles.ratingText}>5.00</Text>
        </View>

        <View style={styles.grid}>
          {QUICK_LINKS.map((item) => (
            <TouchableOpacity key={item.key} style={styles.gridTile} activeOpacity={0.7}>
              <Ionicons name={item.icon} size={20} color="#000" />
              <Text style={styles.gridLabel}>{item.label}</Text>
              {item.dot ? <View style={styles.gridDot} /> : null}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoText}>
            <Text style={styles.promoTitle}>{PROMO_CARDS[0].title}</Text>
            <Text style={styles.promoSubtitle}>{PROMO_CARDS[0].subtitle}</Text>
          </View>
          <Text style={styles.promoEmoji}>{PROMO_CARDS[0].emoji}</Text>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoText}>
            <Text style={styles.promoTitle}>Contrôle de sécurité</Text>
            <Text style={styles.promoSubtitle}>Découvrez comment rendre les trajets plus sûrs</Text>
          </View>
          <View style={styles.progressRing}>
            <View style={styles.progressRingBase} />
            <View style={styles.progressRingFill} />
            <Text style={styles.progressText}>1/4</Text>
          </View>
        </View>

        <View style={[styles.promoCard, styles.co2Card]}>
          <Text style={styles.promoTitle}>Économies de CO₂ estimées</Text>
          <View style={styles.co2Value}>
            <Text style={styles.leafEmoji}>🍃</Text>
            <Text style={styles.co2Number}>3,3 kg</Text>
          </View>
        </View>

        {PROMO_CARDS.slice(1).map((card) => (
          <View key={card.key} style={styles.promoCard}>
            <View style={styles.promoText}>
              <Text style={styles.promoTitle}>{card.title}</Text>
              <Text style={styles.promoSubtitle}>{card.subtitle}</Text>
            </View>
            <Text style={styles.promoEmoji}>{card.emoji}</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  name: {
    flex: 1,
    fontSize: 34,
    fontWeight: '800',
    color: '#000',
    marginRight: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4a4a4a',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginLeft: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  gridTile: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  gridLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 10,
  },
  gridDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#1e90ff',
    marginLeft: 6,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },
  promoText: {
    flex: 1,
    marginRight: 12,
  },
  promoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#6b6b6b',
    marginTop: 4,
    lineHeight: 19,
  },
  promoEmoji: {
    fontSize: 44,
  },
  progressRing: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingBase: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: '#e0e0e0',
  },
  progressRingFill: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#1e90ff',
    borderRightColor: '#1e90ff',
    transform: [{ rotate: '-45deg' }],
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e90ff',
  },
  co2Card: {
    alignItems: 'center',
  },
  co2Value: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leafEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  co2Number: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
  },
});
