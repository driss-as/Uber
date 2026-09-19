import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'uber_recent_searches';
const MAX_RECENTS = 3;

export async function getRecentSearches() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Ignore les entrées sauvegardées avant l'ajout des coordonnées (lat/lng manquants)
    return parsed.filter((item) => typeof item.lat === 'number' && typeof item.lng === 'number');
  } catch (error) {
    return [];
  }
}

// Ajoute une recherche en tête de liste ; ne garde que les MAX_RECENTS plus récentes
export async function addRecentSearch(destination) {
  const entry = {
    title: destination.name || destination.address || 'Destination',
    subtitle: destination.address || '',
    lat: destination.lat,
    lng: destination.lng,
  };

  try {
    const existing = await getRecentSearches();
    const deduped = existing.filter((item) => item.title !== entry.title);
    const updated = [entry, ...deduped].slice(0, MAX_RECENTS);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    return [entry];
  }
}
