import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { CURRENT_LOCATION } from './DestinationMapScreen';
import { CAR_ICONS } from '../data/carIcons';

function formatPrice(value) {
  return `${value.toFixed(2).replace('.', ',')} €`;
}

export default function PaymentScreen({ ride, route, destination, onBack, onConfirm }) {
  const routeCoordinates = route ?? [
    { latitude: CURRENT_LOCATION.lat, longitude: CURRENT_LOCATION.lng },
    { latitude: destination.lat, longitude: destination.lng },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Récapitulatif</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mapWrap}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            initialRegion={{
              latitude: (CURRENT_LOCATION.lat + destination.lat) / 2,
              longitude: (CURRENT_LOCATION.lng + destination.lng) / 2,
              latitudeDelta: Math.max(0.02, Math.abs(CURRENT_LOCATION.lat - destination.lat) * 1.8),
              longitudeDelta: Math.max(0.02, Math.abs(CURRENT_LOCATION.lng - destination.lng) * 1.8),
            }}
          >
            <Polyline coordinates={routeCoordinates} strokeColor="#4a4a4a" strokeWidth={3} />
            <Marker
              coordinate={{ latitude: CURRENT_LOCATION.lat, longitude: CURRENT_LOCATION.lng }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.originDotMarker} />
            </Marker>
            <Marker
              coordinate={{ latitude: destination.lat, longitude: destination.lng }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.destinationSquareMarker} />
            </Marker>
          </MapView>
        </View>

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
              {destination.name || destination.address}
            </Text>
          </View>
        </View>

        <View style={styles.rideCard}>
          <View style={styles.rideIconWrap}>
            <Image source={CAR_ICONS[ride.id]} style={styles.rideCarImage} resizeMode="contain" />
          </View>

          <View style={styles.rideInfo}>
            <Text style={styles.rideName}>{ride.name}</Text>
            <Text style={styles.rideTime}>{ride.timeLabel}</Text>
          </View>

          <Text style={styles.ridePrice}>{formatPrice(ride.price)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Votre chauffeur</Text>
        <View style={styles.driverCard}>
          <Image source={{ uri: ride.driver.photo }} style={styles.driverPhoto} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{ride.driver.name}</Text>
            <View style={styles.driverRatingRow}>
              <Ionicons name="star" size={14} color="#000" />
              <Text style={styles.driverRatingText}>{ride.driver.rating}</Text>
            </View>
            <Text style={styles.driverCarModel}>{ride.driver.model}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Moyen de paiement</Text>
        <TouchableOpacity style={styles.payRow} activeOpacity={0.7}>
          <Ionicons name="logo-apple" size={20} color="#000" />
          <Text style={styles.payText}>Apple Pay</Text>
          <Ionicons name="chevron-forward" size={16} color="#9a9a9a" style={styles.payChevron} />
        </TouchableOpacity>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(ride.price)}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} activeOpacity={0.85} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>Confirmer {ride.name}</Text>
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
    paddingBottom: 20,
  },
  mapWrap: {
    height: 150,
    marginHorizontal: 20,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  map: {
    flex: 1,
  },
  originDotMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  destinationSquareMarker: {
    width: 14,
    height: 14,
    backgroundColor: '#000',
  },
  routeCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    marginHorizontal: 20,
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
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  rideIconWrap: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideCarImage: {
    width: 58,
    height: 58,
  },
  rideInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rideName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 28,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  driverPhoto: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#f0f0f0',
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#000',
  },
  driverRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  driverRatingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginLeft: 6,
  },
  driverCarModel: {
    fontSize: 14,
    color: '#6b6b6b',
    marginTop: 6,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginHorizontal: 20,
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 20,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
  },
  confirmButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
