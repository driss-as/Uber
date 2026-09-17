import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { key: 'accueil', label: 'Accueil', icon: 'home' },
  { key: 'services', label: 'Services', icon: 'grid' },
  { key: 'activite', label: 'Activité', icon: 'receipt-outline' },
  { key: 'compte', label: 'Compte', icon: 'person-circle-outline', dot: true },
];

export default function BottomTabBar({ active, onChange }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: 10 + insets.bottom, marginBottom: 4 }]}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => onChange && onChange(tab.key)}
          >
            <View>
              <Ionicons name={tab.icon} size={24} color={isActive ? '#000' : '#9a9a9a'} />
              {tab.dot ? <View style={styles.dot} /> : null}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: '#9a9a9a',
    marginTop: 4,
    fontWeight: '600',
  },
  labelActive: {
    color: '#000',
  },
  dot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1e90ff',
  },
});
