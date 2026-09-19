import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { CURRENT_LOCATION } from '../screens/DestinationMapScreen';
import { fetchRoute } from '../utils/routes';

// Petite carte non-interactive retraçant le trajet du domicile vers `destination`
export default function TripRouteMap({ destination, height = 150 }) {
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

  const coordinates = route?.coordinates ?? [
    { latitude: CURRENT_LOCATION.lat, longitude: CURRENT_LOCATION.lng },
    { latitude: destination.lat, longitude: destination.lng },
  ];

  return (
    <View style={[styles.mapWrap, { height }]} pointerEvents="none">
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
        <Polyline coordinates={coordinates} strokeColor="#4a4a4a" strokeWidth={3} />
        <Marker
          coordinate={{ latitude: CURRENT_LOCATION.lat, longitude: CURRENT_LOCATION.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.originDotMarker} />
        </Marker>
        <Marker coordinate={{ latitude: destination.lat, longitude: destination.lng }} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.destinationSquareMarker} />
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    borderRadius: 10,
    overflow: 'hidden',
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
});
