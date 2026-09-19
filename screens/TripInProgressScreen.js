import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { CURRENT_LOCATION } from './DestinationMapScreen';
import { CAR_ICONS } from '../data/carIcons';
import { fetchRoute } from '../utils/routes';

// Durée (en secondes) de l'animation visuelle du chauffeur, indépendante du temps
// d'arrivée affiché : garantit un déplacement bien visible même pour un trajet court ou long
const ANIMATION_SECONDS = 50;
const DEFAULT_PICKUP_SECONDS = 240;

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Position interpolée en douceur le long du tracé selon la progression (0 -> 1)
function positionAlongRoute(coordinates, progress) {
  if (!coordinates || coordinates.length === 0) return null;
  const scaled = progress * (coordinates.length - 1);
  const index = Math.min(coordinates.length - 2, Math.floor(scaled));
  const fraction = scaled - index;
  const a = coordinates[index];
  const b = coordinates[Math.min(coordinates.length - 1, index + 1)];

  return {
    latitude: a.latitude + (b.latitude - a.latitude) * fraction,
    longitude: a.longitude + (b.longitude - a.longitude) * fraction,
  };
}

export default function TripInProgressScreen({ ride, destination, onDone, onMinimize }) {
  const mapRef = useRef(null);
  const [route, setRoute] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_PICKUP_SECONDS);
  const [now, setNow] = useState(Date.now());
  const startTimeRef = useRef(Date.now());

  const driverStart = { lat: ride.driver.lat, lng: ride.driver.lng };

  useEffect(() => {
    let cancelled = false;
    fetchRoute(driverStart, CURRENT_LOCATION)
      .then((result) => {
        if (cancelled) return;
        setRoute(result);
        setTotalSeconds(Math.max(30, result.durationMinutes * 60));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 150);
    return () => clearInterval(interval);
  }, []);

  const animationProgress = Math.min(1, (now - startTimeRef.current) / 1000 / ANIMATION_SECONDS);
  const remainingSeconds = Math.max(0, Math.round(totalSeconds * (1 - animationProgress)));
  const routeCoordinates = route?.coordinates ?? [
    { latitude: driverStart.lat, longitude: driverStart.lng },
    { latitude: CURRENT_LOCATION.lat, longitude: CURRENT_LOCATION.lng },
  ];
  const driverPosition = positionAlongRoute(routeCoordinates, animationProgress) ?? routeCoordinates[0];
  const arrived = animationProgress >= 1;

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.fitToCoordinates(routeCoordinates, {
      edgePadding: { top: 100, right: 80, bottom: 260, left: 80 },
      animated: true,
    });
  }, [route]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: (driverStart.lat + CURRENT_LOCATION.lat) / 2,
          longitude: (driverStart.lng + CURRENT_LOCATION.lng) / 2,
          latitudeDelta: Math.max(0.02, Math.abs(driverStart.lat - CURRENT_LOCATION.lat) * 1.8),
          longitudeDelta: Math.max(0.02, Math.abs(driverStart.lng - CURRENT_LOCATION.lng) * 1.8),
        }}
      >
        <Polyline coordinates={routeCoordinates} strokeColor="#4a4a4a" strokeWidth={4} />

        <Marker
          coordinate={{ latitude: CURRENT_LOCATION.lat, longitude: CURRENT_LOCATION.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.userDot} />
        </Marker>

        <Marker coordinate={driverPosition} anchor={{ x: 0.5, y: 0.5 }}>
          <Image source={CAR_ICONS[ride.id]} style={styles.driverCarImage} resizeMode="contain" />
        </Marker>
      </MapView>

      <SafeAreaView style={styles.topOverlay} edges={['top']} pointerEvents="box-none">
        <TouchableOpacity style={styles.minimizeButton} activeOpacity={0.7} onPress={onMinimize}>
          <Ionicons name="chevron-down" size={22} color="#000" />
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView style={styles.sheet} edges={['bottom']}>
        <View style={styles.sheetHandle} />

        {arrived ? (
          <>
            <Text style={styles.statusTitle}>Votre chauffeur est arrivé</Text>
            <Text style={styles.statusSubtitle}>{ride.driver.name} vous attend à proximité</Text>
          </>
        ) : (
          <>
            <Text style={styles.statusTitle}>Arrivée dans {formatCountdown(remainingSeconds)}</Text>
            <Text style={styles.statusSubtitle}>{ride.driver.name} est en route pour vous récupérer</Text>
          </>
        )}

        <View style={styles.driverCard}>
          <Image source={{ uri: ride.driver.photo }} style={styles.driverPhoto} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{ride.driver.name}</Text>
            <View style={styles.driverRatingRow}>
              <Ionicons name="star" size={13} color="#000" />
              <Text style={styles.driverRatingText}>{ride.driver.rating}</Text>
            </View>
            <Text style={styles.driverCarModel}>{ride.driver.model}</Text>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.driverActionButton} activeOpacity={0.7}>
              <Ionicons name="chatbubble-outline" size={18} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.driverActionButton} activeOpacity={0.7}>
              <Ionicons name="call-outline" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {arrived ? (
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={onDone}>
            <Text style={styles.primaryButtonText}>C'est parti</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.cancelButton} activeOpacity={0.7} onPress={onDone}>
            <Text style={styles.cancelButtonText}>Annuler la course</Text>
          </TouchableOpacity>
        )}
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
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  minimizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  userDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1e90ff',
    borderWidth: 3,
    borderColor: '#fff',
  },
  driverCarImage: {
    width: 40,
    height: 40,
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
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d9d9d9',
    alignSelf: 'center',
    marginBottom: 14,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6b6b6b',
    marginTop: 4,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  driverPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  driverRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  driverRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
  },
  driverCarModel: {
    fontSize: 13,
    color: '#6b6b6b',
    marginTop: 2,
  },
  driverActions: {
    flexDirection: 'row',
  },
  driverActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c0392b',
  },
});
