import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getRideHistory } from '../data/rideHistory';
import TripRouteMap from '../components/TripRouteMap';

// Affiché tant qu'aucune course réelle n'a encore été confirmée
const DEFAULT_RIDE_HISTORY = [
  {
    key: 'gare-du-nord',
    title: 'Gare du Nord',
    date: '22 mai • 17:16',
    price: '22,94€',
    destination: { lat: 48.8809, lng: 2.3553 },
  },
  {
    key: 'tour-eiffel',
    title: 'Tour Eiffel',
    date: '18 mai • 09:32',
    price: '14,50€',
    destination: { lat: 48.8584, lng: 2.2945 },
  },
  {
    key: 'orly',
    title: "Aéroport d'Orly",
    date: '5 mai • 06:15',
    price: '38,20€',
    destination: { lat: 48.7262, lng: 2.3652 },
  },
  {
    key: 'la-defense',
    title: 'La Défense',
    date: '29 avr. • 18:47',
    price: '19,80€',
    destination: { lat: 48.8918, lng: 2.236 },
  },
];

export default function ActivityScreen({ onRebook, onOpenTrip, activeTrip, onResumeTrip }) {
  const [rideHistory, setRideHistory] = useState(DEFAULT_RIDE_HISTORY);

  useEffect(() => {
    getRideHistory().then((stored) => {
      if (stored.length > 0) setRideHistory([...stored, ...DEFAULT_RIDE_HISTORY]);
    });
  }, []);

  const fullList = activeTrip ? [activeTrip, ...rideHistory] : rideHistory;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Activité</Text>

        <View style={styles.pastHeaderRow}>
          <Text style={styles.sectionTitle}>Passées</Text>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {fullList.map((ride) => {
          const rebook = () =>
            onRebook &&
            onRebook({
              lat: ride.destination.lat,
              lng: ride.destination.lng,
              name: ride.title,
              address: ride.title,
            });

          return (
            <TouchableOpacity
              key={ride.key}
              style={[styles.tripCard, ride.inProgress && styles.tripCardActive]}
              activeOpacity={0.85}
              onPress={() => (ride.inProgress ? onResumeTrip && onResumeTrip() : onOpenTrip && onOpenTrip(ride))}
            >
              <View style={styles.mapSpacing}>
                <TripRouteMap destination={ride.destination} />
              </View>

              {ride.inProgress ? (
                <View style={styles.inProgressBadge}>
                  <View style={styles.inProgressDot} />
                  <Text style={styles.inProgressBadgeText}>Course en cours</Text>
                </View>
              ) : null}

              <Text style={styles.tripTitle}>{ride.title}</Text>
              <Text style={styles.tripSubtitle}>{ride.date}</Text>
              <Text style={styles.tripSubtitle}>{ride.price}</Text>

              {ride.inProgress ? (
                <View style={styles.tripActions}>
                  <TouchableOpacity style={styles.pillButton} activeOpacity={0.7} onPress={onResumeTrip}>
                    <Ionicons name="navigate-outline" size={16} color="#000" />
                    <Text style={styles.pillButtonText}>Suivre la course</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.tripActions}>
                  <TouchableOpacity style={styles.pillButton} activeOpacity={0.7}>
                    <Ionicons name="star-outline" size={16} color="#000" />
                    <Text style={styles.pillButtonText}>Note</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.pillButton} activeOpacity={0.7} onPress={rebook}>
                    <Ionicons name="repeat" size={16} color="#000" />
                    <Text style={styles.pillButtonText}>Réserver</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
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
  tripCardActive: {
    borderColor: '#000',
    borderWidth: 1.5,
  },
  inProgressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  inProgressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
    marginRight: 6,
  },
  inProgressBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  mapSpacing: {
    marginBottom: 14,
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
  pillButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginLeft: 6,
  },
});
