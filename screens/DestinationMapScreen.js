import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { DRIVERS } from '../data/drivers';

// Position de départ fictive (adresse inventée, coordonnées réelles à Paris)
export const CURRENT_LOCATION = {
  address: '8 Rue de Charonne, 75011 Paris',
  lat: 48.8534,
  lng: 2.38,
};

const GOOGLE_MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY;
const IOS_BUNDLE_ID = 'com.drissas.Uber';

// Recherche de lieux via l'API Places (New) de Google, centrée sur Paris
async function fetchPlaceSuggestions(input) {
  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_KEY,
      'X-Goog-FieldMask':
        'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
      'X-Ios-Bundle-Identifier': IOS_BUNDLE_ID,
    },
    body: JSON.stringify({
      input,
      languageCode: 'fr',
      includedRegionCodes: ['fr'],
      locationBias: {
        circle: {
          center: { latitude: CURRENT_LOCATION.lat, longitude: CURRENT_LOCATION.lng },
          radius: 50000,
        },
      },
    }),
  });

  if (!response.ok) throw new Error(`Places API error: ${response.status}`);
  const data = await response.json();
  return data.suggestions || [];
}

// Récupère les coordonnées d'un lieu choisi (Place Details New)
async function fetchPlaceLocation(placeId) {
  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': GOOGLE_MAPS_KEY,
      'X-Goog-FieldMask': 'location,formattedAddress,displayName',
      'X-Ios-Bundle-Identifier': IOS_BUNDLE_ID,
    },
  });

  if (!response.ok) throw new Error(`Place Details API error: ${response.status}`);
  const data = await response.json();
  return {
    lat: data.location.latitude,
    lng: data.location.longitude,
    name: data.displayName?.text,
    address: data.formattedAddress,
  };
}

// Distance parcourue par chaque VTC avant de faire demi-tour (mètres) et durée d'un aller-retour complet
const DRIVE_DISTANCE_METERS = 280;
const DRIVE_CYCLE_MS = 52000;

// Point situé à `meters` de (lat, lng) dans la direction `heading` (0° = nord)
function offsetCoordinate(lat, lng, heading, meters) {
  const rad = (heading * Math.PI) / 180;
  const dLat = (meters * Math.cos(rad)) / 111320;
  const dLng = (meters * Math.sin(rad)) / (111320 * Math.cos((lat * Math.PI) / 180));
  return { lat: lat + dLat, lng: lng + dLng };
}

// Vitesse propre à chaque voiture (0.6x à 1.6x la vitesse de base), dérivée de son id
function speedFactor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 137 + id.charCodeAt(i) * (i + 7)) % 1000;
  return 0.6 + (hash / 1000) * 1.0;
}

// Nombre pseudo-aléatoire (0-1) déterministe à partir d'une seed, pour varier
// chaque trajet sans dépendre d'un état stocké
function pseudoRandom(seed) {
  const x = Math.sin(seed) * 43758.5453123;
  return x - Math.floor(x);
}

function idSeed(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 131 + id.charCodeAt(i)) % 100000;
  return hash;
}

// Paramètres du trajet en cours (distance, direction, vitesse), tirés au sort
// à chaque nouveau cycle pour que la voiture ne refasse jamais le même aller-retour
function legParamsFor(id, legIndex) {
  const seed = idSeed(id) + legIndex * 97.13;
  return {
    // La distance varie à chaque trajet ; à durée de cycle égale, ça fait déjà
    // paraître certains trajets plus rapides ou plus lents que d'autres.
    distanceMeters: 100 + pseudoRandom(seed) * 420, // 100m à 520m
    headingOffset: (pseudoRandom(seed + 12.9) * 2 - 1) * 60, // ±60° par rapport au cap de base
  };
}

// Durée fixe (en ms) du virage à 180°, indépendante de la vitesse de la voiture
const TURN_DURATION_MS = 2600;

// Rotation progressive : cap constant en ligne droite, pivote doucement sur
// `TURN_DURATION_MS` au demi-tour (cycle ≈ 0.5) et au retour au point de départ (cycle ≈ 0 / 1)
function rotationForCycle(cycle, cycleMs, heading) {
  const half = Math.min(TURN_DURATION_MS / cycleMs / 2, 0.2);

  if (Math.abs(cycle - 0.5) < half) {
    const t = (cycle - (0.5 - half)) / (2 * half); // 0 -> 1
    return heading + 180 * t;
  }

  const distToWrap = Math.min(cycle, 1 - cycle);
  if (distToWrap < half) {
    const t = cycle < 0.5 ? 1 - cycle / half : (cycle - (1 - half)) / half; // 0 -> 1
    return heading + 180 + 180 * t;
  }

  return cycle < 0.5 ? heading : heading + 180;
}

function useDrivingPositions(drivers) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 150);
    return () => clearInterval(interval);
  }, []);

  return drivers.map((driver, index) => {
    // Chaque voiture a son propre rythme de base et démarre à un point différent
    // de son cycle (réparti selon son rang) pour désynchroniser les voitures.
    const baseCycleMs = DRIVE_CYCLE_MS / speedFactor(driver.id);
    const phase = (index / drivers.length) * baseCycleMs;
    const totalElapsed = now + phase;

    // À chaque nouveau trajet (leg), on tire une distance et une direction
    // différentes : la voiture ne refait jamais le même aller-retour.
    const legIndex = Math.floor(totalElapsed / baseCycleMs);
    const leg = legParamsFor(driver.id, legIndex);
    const legHeading = driver.heading + leg.headingOffset;

    const to = offsetCoordinate(driver.lat, driver.lng, legHeading, leg.distanceMeters);
    const elapsed = totalElapsed % baseCycleMs;
    const cycle = elapsed / baseCycleMs; // 0 -> 1
    const progress = 1 - Math.abs(cycle * 2 - 1); // va-et-vient triangulaire 0 -> 1 -> 0
    const rotation = ((rotationForCycle(cycle, baseCycleMs, legHeading) % 360) + 360) % 360;

    return {
      ...driver,
      lat: driver.lat + (to.lat - driver.lat) * progress,
      lng: driver.lng + (to.lng - driver.lng) * progress,
      rotation,
    };
  });
}

export default function DestinationMapScreen({ onBack, onSelectDestination }) {
  const animatedDrivers = useDrivingPositions(DRIVERS);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);
  const debounceRef = useRef(null);

  const handleChangeQuery = (text) => {
    setQuery(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await fetchPlaceSuggestions(text);
        setSuggestions(results);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  const handleSelectSuggestion = async (suggestion) => {
    setQuery(suggestion.placePrediction.text.text);
    setSuggestions([]);
    setResolving(true);
    try {
      const place = await fetchPlaceLocation(suggestion.placePrediction.placeId);
      onSelectDestination(place);
    } catch (error) {
      setResolving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onPress={() => setSheetOpen(false)}
        initialRegion={{
          latitude: CURRENT_LOCATION.lat,
          longitude: CURRENT_LOCATION.lng,
          latitudeDelta: 0.32,
          longitudeDelta: 0.32,
        }}
      >
        <Marker
          coordinate={{ latitude: CURRENT_LOCATION.lat, longitude: CURRENT_LOCATION.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.userDot} />
        </Marker>

        {animatedDrivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{ latitude: driver.lat, longitude: driver.lng }}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={driver.rotation}
            flat
          >
            <View style={styles.carMarker}>
              <Image
                source={require('../assets/top-car.png')}
                style={styles.carImage}
                resizeMode="contain"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      <SafeAreaView style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>

          <View style={styles.locationBadge}>
            <View style={styles.locationBadgeDot} />
            <Text style={styles.locationBadgeText} numberOfLines={1}>
              {CURRENT_LOCATION.address}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {sheetOpen ? (
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setSheetOpen(false)}>
            <View style={styles.sheetHandle} />
          </TouchableOpacity>
          <Text style={styles.sheetTitle}>Indiquez votre destination</Text>
          <Text style={styles.sheetSubtitle}>Recherchez une adresse ou choisissez sur la carte</Text>

          <View style={styles.searchInputRow}>
            <View style={styles.searchDot} />
            <TextInput
              style={styles.searchInput}
              placeholder="Où allez-vous ?"
              placeholderTextColor="#9a9a9a"
              value={query}
              onChangeText={handleChangeQuery}
              autoCorrect={false}
              autoComplete="off"
              spellCheck={false}
            />
            {searching ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="search" size={18} color="#000" />
            )}
          </View>

          {suggestions.length > 0 ? (
            <ScrollView style={styles.suggestionsList} showsVerticalScrollIndicator={false}>
              {suggestions.map((suggestion) => {
                const prediction = suggestion.placePrediction;
                const main = prediction.structuredFormat?.mainText?.text ?? prediction.text.text;
                const secondary = prediction.structuredFormat?.secondaryText?.text;

                return (
                  <TouchableOpacity
                    key={prediction.placeId}
                    style={styles.suggestionRow}
                    activeOpacity={0.7}
                    onPress={() => handleSelectSuggestion(suggestion)}
                  >
                    <Ionicons name="location-outline" size={18} color="#6b6b6b" />
                    <View style={styles.suggestionTextWrap}>
                      <Text style={styles.suggestionMain} numberOfLines={1}>
                        {main}
                      </Text>
                      {secondary ? (
                        <Text style={styles.suggestionSecondary} numberOfLines={1}>
                          {secondary}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}>
              <Text style={styles.searchButtonText}>Rechercher une destination</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.collapsedSheetWrap} edges={['bottom']} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.collapsedSheet}
            activeOpacity={0.8}
            onPress={() => setSheetOpen(true)}
          >
            <View style={styles.searchDot} />
            <Text style={styles.collapsedSheetText}>Où allez-vous ?</Text>
            <Ionicons name="chevron-up" size={18} color="#000" />
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {resolving ? (
        <View style={styles.resolvingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : null}
    </KeyboardAvoidingView>
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
  resolvingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1e90ff',
    borderWidth: 3,
    borderColor: '#fff',
  },
  carMarker: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: 34,
    height: 19,
    transform: [{ rotate: '90deg' }],
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
    marginTop: Platform.OS === 'android' ? 16 : 8,
    paddingHorizontal: 16,
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
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginLeft: 10,
    flexShrink: 1,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  locationBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1e90ff',
    marginRight: 8,
  },
  locationBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
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
  collapsedSheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: 12,
  },
  collapsedSheet: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 6,
  },
  collapsedSheetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 10,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#6b6b6b',
    marginTop: 6,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 16,
  },
  searchDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#000',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 14,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  suggestionsList: {
    maxHeight: 320,
    marginTop: 8,
    marginBottom: 14,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  suggestionTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionMain: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  suggestionSecondary: {
    fontSize: 13,
    color: '#6b6b6b',
    marginTop: 1,
  },
});
