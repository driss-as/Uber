import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import ServicesScreen from './screens/ServicesScreen';
import ActivityScreen from './screens/ActivityScreen';
import AccountScreen from './screens/AccountScreen';
import DestinationMapScreen from './screens/DestinationMapScreen';
import RideSelectionScreen from './screens/RideSelectionScreen';
import PaymentScreen from './screens/PaymentScreen';
import TripInProgressScreen from './screens/TripInProgressScreen';
import TripDetailScreen from './screens/TripDetailScreen';
import BottomTabBar from './components/BottomTabBar';
import { addRecentSearch } from './data/recentSearches';
import { addRideHistoryEntry } from './data/rideHistory';

function AppContent() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [showDestinationMap, setShowDestinationMap] = useState(false);
  const [rideDestination, setRideDestination] = useState(null);
  const [chosenRide, setChosenRide] = useState(null);
  const [chosenRoute, setChosenRoute] = useState(null);
  const [tripConfirmed, setTripConfirmed] = useState(false);
  const [tripMinimized, setTripMinimized] = useState(false);
  const [openTrip, setOpenTrip] = useState(null);

  const resetToHome = () => {
    setTripConfirmed(false);
    setTripMinimized(false);
    setChosenRide(null);
    setChosenRoute(null);
    setRideDestination(null);
  };

  const activeTrip =
    tripConfirmed && chosenRide && rideDestination
      ? {
          key: 'active-trip',
          title: rideDestination.name || rideDestination.address,
          date: 'En cours',
          price: `${chosenRide.price.toFixed(2).replace('.', ',')}€`,
          destination: { lat: rideDestination.lat, lng: rideDestination.lng },
          inProgress: true,
        }
      : null;

  if (tripConfirmed && !tripMinimized) {
    return (
      <TripInProgressScreen
        ride={chosenRide}
        destination={rideDestination}
        onDone={resetToHome}
        onMinimize={() => setTripMinimized(true)}
      />
    );
  }

  if (openTrip && !tripConfirmed) {
    return (
      <TripDetailScreen
        ride={openTrip}
        onBack={() => setOpenTrip(null)}
        onRebook={() => {
          setRideDestination({
            lat: openTrip.destination.lat,
            lng: openTrip.destination.lng,
            name: openTrip.title,
            address: openTrip.title,
          });
          setOpenTrip(null);
        }}
      />
    );
  }

  if (chosenRide && !tripConfirmed) {
    return (
      <PaymentScreen
        ride={chosenRide}
        route={chosenRoute}
        destination={rideDestination}
        onBack={() => setChosenRide(null)}
        onConfirm={() => {
          addRideHistoryEntry({ ride: chosenRide, destination: rideDestination });
          setTripConfirmed(true);
        }}
      />
    );
  }

  if (rideDestination && !tripConfirmed) {
    return (
      <RideSelectionScreen
        destination={rideDestination}
        onBack={() => {
          setRideDestination(null);
          setShowDestinationMap(true);
        }}
        onChooseRide={(ride, route) => {
          setChosenRide(ride);
          setChosenRoute(route);
        }}
      />
    );
  }

  if (showDestinationMap) {
    return (
      <DestinationMapScreen
        onBack={() => setShowDestinationMap(false)}
        onSelectDestination={(destination) => {
          addRecentSearch(destination);
          setRideDestination(destination);
          setShowDestinationMap(false);
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {activeTab === 'services' ? (
          <ServicesScreen onSelectDestination={setRideDestination} />
        ) : activeTab === 'activite' ? (
          <ActivityScreen
            onRebook={setRideDestination}
            onOpenTrip={setOpenTrip}
            activeTrip={activeTrip}
            onResumeTrip={() => setTripMinimized(false)}
          />
        ) : activeTab === 'compte' ? (
          <AccountScreen />
        ) : (
          <HomeScreen
            onPressSearch={() => setShowDestinationMap(true)}
            onSelectRecent={setRideDestination}
          />
        )}
      </View>

      <BottomTabBar active={activeTab} onChange={setActiveTab} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: {
    flex: 1,
  },
});
