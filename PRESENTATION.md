```
 _    _ ____  ______ _____     _____ _      ____  _   _ ______ 
| |  | |  _ \|  ____|  __ \   / ____| |    / __ \| \ | |  ____|
| |  | | |_) | |__  | |__) | | |    | |   | |  | |  \| | |__   
| |  | |  _ <|  __| |  _  /  | |    | |   | |  | | . ` |  __|  
| |__| | |_) | |____| | \ \  | |____| |___| |__| | |\  | |____ 
 \____/|____/|______|_|  \_\  \_____|______\____/|_| \_|______|
```

```
  ____ ___  _   _ _____ _______  _______ _____ 
 / ___/ _ \| \ | |_   _| ____\ \/ /_   _| ____|
| |  | | | |  \| | | | |  _|  \  /  | | |  _|  
| |__| |_| | |\  | | | | |___ /  \  | | | |___ 
 \____\___/|_| \_| |_| |_____/_/\_\ |_| |_____|
```

Ce projet a été réalisé dans le cadre de la **formation Studio IA, gratuite**. Il s'agit d'un exercice pédagogique visant à découvrir le développement d'une application mobile avec **Expo / React Native**, en s'appuyant sur l'assistance d'un agent IA (Claude Code) pour la génération et l'itération du code.

L'objectif n'est pas de produire un produit commercial, mais de manipuler concrètement :
- la structure d'une application mobile multi-écrans,
- la navigation entre écrans,
- la gestion de données locales (mock data),
- l'intégration de cartes et de composants natifs,
- le workflow de développement assisté par IA.

```
    _    ____  ____  _     ___ ____    _  _____ ___ ___  _   _ 
   / \  |  _ \|  _ \| |   |_ _/ ___|  / \|_   _|_ _/ _ \| \ | |
  / _ \ | |_) | |_) | |    | | |     / _ \ | |  | | | | |  \| |
 / ___ \|  __/|  __/| |___ | | |___ / ___ \| |  | | |_| | |\  |
/_/   \_\_|   |_|   |_____|___\____/_/   \_\_| |___\___/|_| \_|
```

L'application est un **clone simplifié d'Uber**, permettant de simuler le parcours d'un utilisateur réservant une course : recherche de destination, choix du type de véhicule, paiement, suivi du trajet et historique des courses.

### Écrans principaux (`screens/`)
- **HomeScreen** — écran d'accueil avec recherche de destination
- **DestinationMapScreen** — sélection de la destination sur une carte
- **RideSelectionScreen** — choix du type de course (UberX, Comfort, etc.)
- **PaymentScreen** — sélection du moyen de paiement
- **TripInProgressScreen** — suivi en temps réel simulé d'une course
- **TripDetailScreen** — détail d'une course passée
- **ActivityScreen** — historique des activités/courses
- **ServicesScreen** — liste des services proposés (VTC, livraison, etc.)
- **AccountScreen** — profil utilisateur

### Composants (`components/`)
- **BottomTabBar** — barre de navigation inférieure
- **TripRouteMap** — affichage de l'itinéraire sur une carte

### Données (`data/`)
Données statiques simulées (mock) : destinations, historique de courses, conducteurs, recherches récentes, icônes de véhicules — aucune connexion à un backend réel.

```
 ____ _____  _    ____ _  __     _____ _____ ____ _   _ _   _ ___ ___  _   _ _____ 
/ ___|_   _|/ \  / ___| |/ /    |_   _| ____/ ___| | | | \ | |_ _/ _ \| | | | ____|
\___ \ | | / _ \| |   | ' /       | | |  _|| |   | |_| |  \| || | | | | | | |  _|  
 ___) || |/ ___ \ |___| . \       | | | |__| |___|  _  | |\  || | |_| | |_| | |___ 
|____/ |_/_/   \_\____|_|\_\      |_| |_____\____|_| |_|_| \_|___\__\_\\___/|_____|
```

- **Expo SDK 57** (React Native 0.86, React 19)
- `react-native-maps` pour l'affichage cartographique
- `react-native-webview`
- `@react-native-async-storage/async-storage` pour la persistance locale
- Navigation gérée manuellement (sans librairie de routing tierce)

```
 _     ___ __  __ ___ _____ _____ ____  
| |   |_ _|  \/  |_ _|_   _| ____/ ___| 
| |    | || |\/| || |  | | |  _| \___ \ 
| |___ | || |  | || |  | | | |___ ___) |
|_____|___|_|  |_|___| |_| |_____|____/ 
```

Application de démonstration à but pédagogique :
- Aucune donnée réelle (courses, conducteurs, paiements simulés)
- Pas de backend ni d'API réelle
- Pas de gestion d'authentification
- Non destinée à un usage en production

```
 _____ ___  ____  __  __    _  _____ ___ ___  _   _ 
|  ___/ _ \|  _ \|  \/  |  / \|_   _|_ _/ _ \| \ | |
| |_ | | | | |_) | |\/| | / _ \ | |  | | | | |  \| |
|  _|| |_| |  _ <| |  | |/ ___ \| |  | | |_| | |\  |
|_|   \___/|_| \_\_|  |_/_/   \_\_| |___\___/|_| \_|
```

Ce projet illustre les compétences abordées dans la formation **Studio IA (offre gratuite)** : utiliser un agent IA comme copilote de développement pour concevoir, structurer et itérer rapidement sur une application mobile complète.

- 🎓 Formation gratuite : https://formation.drissas.com/formation-gratuite
- 🚀 Studio IA : https://formation.drissas.com/studio-ia

```
 ____  _        _    _   _  __     _____ ____  _____ ___  
|  _ \| |      / \  | \ | | \ \   / /_ _|  _ \| ____/ _ \ 
| |_) | |     / _ \ |  \| |  \ \ / / | || | | |  _|| | | |
|  __/| |___ / ___ \| |\  |   \ V /  | || |_| | |__| |_| |
|_|   |_____/_/   \_\_| \_|    \_/  |___|____/|_____\___/
```

1. **On construit la première version de l'app**
2. **Les chauffeurs arrivent sur la carte**
3. **On crée la recherche et les offres de course**
4. **On améliore l'expérience utilisateur**
5. **On ajoute l'historique et le suivi du chauffeur**
6. **Résultat final et conclusion**
