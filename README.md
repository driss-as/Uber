```
 _    _ ____  ______ _____     _____ _      ____  _   _ ______ 
| |  | |  _ \|  ____|  __ \   / ____| |    / __ \| \ | |  ____|
| |  | | |_) | |__  | |__) | | |    | |   | |  | |  \| | |__   
| |  | |  _ <|  __| |  _  /  | |    | |   | |  | | . ` |  __|  
| |__| | |_) | |____| | \ \  | |____| |___| |__| | |\  | |____ 
 \____/|____/|______|_|  \_\  \_____|______\____/|_| \_|______|
```

> Clone simplifié de l'application Uber, développé avec **Expo / React Native** dans le cadre de la **formation Studio IA du Pro (offre gratuite)**.

![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)

🎓 Formation gratuite : https://formation.drissas.com/formation-gratuite
🚀 Studio IA du Pro : https://formation.drissas.com/studio-ia

---

## Le projet

Application pédagogique simulant le parcours d'une course VTC (recherche de destination, choix du véhicule, paiement, suivi du trajet, historique), écrite avec Claude Code comme copilote de développement.

**Écrans principaux :** Home, sélection de destination, choix de course, paiement, suivi de trajet, historique, services, compte.

**Stack :** Expo SDK 57, React Native 0.86, React 19, `react-native-maps`, `react-native-webview`, `async-storage`. Données 100 % simulées (mock), sans backend ni authentification.

## Installation

```bash
git clone <url-du-depot>
cd Uber
npm install
npm start
```

```bash
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
```

Nécessite des clés Google Maps dans les variables d'environnement `EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY` / `EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY`.

## Licence

Voir le fichier [LICENSE](./LICENSE).
