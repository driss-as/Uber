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
import BottomTabBar from './components/BottomTabBar';
import { addRecentSearch } from './data/recentSearches';

function AppContent() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [showDestinationMap, setShowDestinationMap] = useState(false);
  const [rideDestination, setRideDestination] = useState(null);
  const [chosenRide, setChosenRide] = useState(null);
  const [chosenRoute, setChosenRoute] = useState(null);

  if (chosenRide) {
    return (
      <PaymentScreen
        ride={chosenRide}
        route={chosenRoute}
        destination={rideDestination}
        onBack={() => setChosenRide(null)}
        onDone={() => {
          setChosenRide(null);
          setRideDestination(null);
        }}
      />
    );
  }

  if (rideDestination) {
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
          <ServicesScreen />
        ) : activeTab === 'activite' ? (
          <ActivityScreen />
        ) : activeTab === 'compte' ? (
          <AccountScreen />
        ) : (
          <HomeScreen onPressSearch={() => setShowDestinationMap(true)} />
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
