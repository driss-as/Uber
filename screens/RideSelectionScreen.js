import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { CURRENT_LOCATION } from './DestinationMapScreen';
import { DRIVERS, RIDE_TYPES } from '../data/drivers';
import { CAR_ICONS } from '../data/carIcons';
import { haversineKm, fetchRoute } from '../utils/routes';

// Chauffeur le plus proche du domicile pour un type de véhicule donné
function nearestDriverOfType(type) {
  let best = null;
  let bestKm = Infinity;

  DRIVERS.forEach((driver) => {
    if (driver.type !== type) return;
    const km = haversineKm(CURRENT_LOCATION, driver);
    if (km < bestKm) {
      bestKm = km;
      best = driver;
    }
  });

  return { driver: best, pickupKm: bestKm };
}

// Une ligne de course par type de véhicule, associée à son chauffeur le plus proche
function buildRides(distanceKm, durationMinutes) {
  const tripMinutes = durationMinutes ?? Math.max(3, Math.round((distanceKm / 22) * 60));
  const basePrice = 3.5 + distanceKm * 1.7;

  return Object.entries(RIDE_TYPES)
    .map(([type, meta]) => {
      const { driver, pickupKm } = nearestDriverOfType(type);
      if (!driver) return null;
      const pickupMinutes = Math.max(1, Math.round((pickupKm / 22) * 60));

      return {
        id: type,
        name: meta.label,
        capacity: meta.capacity,
        color: meta.color,
        price: basePrice * meta.priceMultiplier,
        timeLabel: `${pickupMinutes} min · trajet ${tripMinutes} min`,
        driver,
      };
    })
    .filter(Boolean);
}

function formatPrice(value) {
  return `${value.toFixed(2).replace('.', ',')} €`;
}

export default function RideSelectionScreen({ destination, onBack, onChooseRide }) {
  const mapRef = useRef(null);
  const [selectedRide, setSelectedRide] = useState('UberX');
  const [route, setRoute] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchRoute(CURRENT_LOCATION, destination)
      .then((result) => {
        if (!cancelled) setRoute(result);
      })
      .catch(() => {
        if (!cancelled) setRoute(null);
      });

    return () => {
      cancelled = true;
    };
  }, [destination]);

  const distanceKm = route?.distanceKm ?? haversineKm(CURRENT_LOCATION, destination);
  const rides = buildRides(distanceKm, route?.durationMinutes);
  const selected = rides.find((ride) => ride.id === selectedRide);

  const routeCoordinates = route?.coordinates ?? [
    { latitude: CURRENT_LOCATION.lat, longitude: CURRENT_LOCATION.lng },
    { latitude: destination.lat, longitude: destination.lng },
  ];

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.fitToCoordinates(routeCoordinates, {
      edgePadding: { top: 190, right: 80, bottom: 60, left: 80 },
      animated: true,
    });
  }, [route, destination]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: (CURRENT_LOCATION.lat + destination.lat) / 2,
          longitude: (CURRENT_LOCATION.lng + destination.lng) / 2,
          latitudeDelta: Math.max(0.02, Math.abs(CURRENT_LOCATION.lat - destination.lat) * 1.8),
          longitudeDelta: Math.max(0.02, Math.abs(CURRENT_LOCATION.lng - destination.lng) * 1.8),
        }}
      >
        <Polyline coordinates={routeCoordinates} strokeColor="#4a4a4a" strokeWidth={4} />

        <Marker
          coordinate={{ latitude: CURRENT_LOCATION.lat, longitude: CURRENT_LOCATION.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.originDot}>
            <View style={styles.originDotInner} />
          </View>
        </Marker>

        <Marker
          coordinate={{ latitude: destination.lat, longitude: destination.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.destinationPin} />
        </Marker>
      </MapView>

      <SafeAreaView style={styles.topOverlay} edges={['top']} pointerEvents="box-none">
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>

          <View style={styles.destinationBadge}>
            {destination.address ? (
              <Text style={styles.destinationBadgeSubtitle} numberOfLines={1}>
                {destination.address}
              </Text>
            ) : null}
            <View style={styles.destinationBadgeTitleRow}>
              <View style={styles.destinationBadgeDot} />
              <Text style={styles.destinationBadgeTitle} numberOfLines={1}>
                {destination.name || 'Destination'}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.sheet} edges={['bottom']}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Choisissez une course</Text>
        <View style={styles.sheetDivider} />

        <ScrollView style={styles.ridesScroll} showsVerticalScrollIndicator={false}>
          {rides.map((ride) => {
            const isSelected = ride.id === selectedRide;
            return (
              <TouchableOpacity
                key={ride.id}
                style={[styles.rideRow, isSelected && styles.rideRowSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedRide(ride.id)}
              >
                <View style={styles.rideIconWrap}>
                  <Image source={CAR_ICONS[ride.id]} style={styles.rideCarImage} resizeMode="contain" />
                </View>

                <View style={styles.rideInfo}>
                  <View style={styles.rideNameRow}>
                    <Text style={styles.rideName}>{ride.name}</Text>
                    {ride.capacity ? (
                      <View style={styles.rideCapacityRow}>
                        <Ionicons name="person" size={12} color="#6b6b6b" />
                        <Text style={styles.rideCapacityText}>{ride.capacity}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.rideTime}>{ride.timeLabel}</Text>
                </View>

                <Text style={styles.ridePrice}>{formatPrice(ride.price)}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sheetDivider} />

        <TouchableOpacity style={styles.payRow} activeOpacity={0.7}>
          <Ionicons name="logo-apple" size={20} color="#000" />
          <Text style={styles.payText}>Apple Pay</Text>
          <Ionicons name="chevron-forward" size={16} color="#9a9a9a" style={styles.payChevron} />
        </TouchableOpacity>

        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.8}
            onPress={() => onChooseRide(selected, routeCoordinates)}
          >
            <Text style={styles.ctaButtonText}>Choisissez {selected.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} activeOpacity={0.7}>
            <Ionicons name="calendar-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9edf3',
  },
  map: {
    flex: 1,
  },
  originDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  originDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1e90ff',
  },
  destinationPin: {
    width: 16,
    height: 16,
    backgroundColor: '#000',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  destinationBadge: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  destinationBadgeSubtitle: {
    fontSize: 11,
    color: '#6b6b6b',
  },
  destinationBadgeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  destinationBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#1e90ff',
    marginRight: 6,
  },
  destinationBadgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    flexShrink: 1,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 8,
  },
  ridesScroll: {
    maxHeight: 320,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d9d9d9',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  sheetDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e5e5',
    marginTop: 12,
  },
  rideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  rideRowSelected: {
    borderColor: '#000',
  },
  rideIconWrap: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideCarImage: {
    width: 82,
    height: 82,
  },
  rideInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rideNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  rideCapacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  rideCapacityText: {
    fontSize: 12,
    color: '#6b6b6b',
    marginLeft: 2,
  },
  rideTime: {
    fontSize: 13,
    color: '#6b6b6b',
    marginTop: 2,
  },
  ridePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginLeft: 8,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  payText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginLeft: 10,
    flex: 1,
  },
  payChevron: {
    marginLeft: 'auto',
  },
  ctaRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  ctaButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  ctaSecondary: {
    width: 52,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
