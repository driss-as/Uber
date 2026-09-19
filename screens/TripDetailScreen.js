import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CURRENT_LOCATION } from './DestinationMapScreen';
import TripRouteMap from '../components/TripRouteMap';

export default function TripDetailScreen({ ride, onBack, onRebook }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la course</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TripRouteMap destination={ride.destination} height={200} />

        <Text style={styles.dateText}>{ride.date}</Text>

        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.originDot} />
            <Text style={styles.routeText} numberOfLines={1}>
              {CURRENT_LOCATION.address}
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={styles.destinationSquare} />
            <Text style={styles.routeText} numberOfLines={1}>
              {ride.title}
            </Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total payé</Text>
          <Text style={styles.priceValue}>{ride.price}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="star-outline" size={18} color="#000" />
            <Text style={styles.actionButtonText}>Noter la course</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="help-circle-outline" size={18} color="#000" />
            <Text style={styles.actionButtonText}>Obtenir de l'aide</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.rebookButton} activeOpacity={0.85} onPress={onRebook}>
          <Ionicons name="repeat" size={18} color="#fff" />
          <Text style={styles.rebookButtonText}>Réserver à nouveau</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#6b6b6b',
    marginTop: 14,
  },
  routeCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1e90ff',
    marginRight: 12,
  },
  destinationSquare: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    marginRight: 12,
  },
  routeLine: {
    width: 1,
    height: 20,
    backgroundColor: '#d9d9d9',
    marginLeft: 4,
    marginVertical: 2,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    flexShrink: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginLeft: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
  },
  rebookButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rebookButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});
