import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'uber_ride_history';
const MAX_HISTORY = 20;

export async function getRideHistory() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

// Ajoute une course confirmée en tête de l'historique
export async function addRideHistoryEntry({ ride, destination }) {
  const now = new Date();
  const entry = {
    key: `ride-${now.getTime()}`,
    title: destination.name || destination.address || 'Destination',
    date: `${now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} • ${now.toLocaleTimeString(
      'fr-FR',
      { hour: '2-digit', minute: '2-digit' }
    )}`,
    price: `${ride.price.toFixed(2).replace('.', ',')}€`,
    destination: { lat: destination.lat, lng: destination.lng },
  };

  try {
    const existing = await getRideHistory();
    const updated = [entry, ...existing].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    return [entry];
  }
}
