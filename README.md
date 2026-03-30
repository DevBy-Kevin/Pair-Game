"# 🎮 Pair Game - Memory Match

Un jeu de mémoire interactif et dynamique construit avec **JavaScript vanilla**. Appariez les paires d'images avant que le temps ne s'écoule !

## 📋 État du Projet

🚧 **En construction** - Le jeu est fonctionnel mais des améliorations et nouvelles fonctionnalités sont en cours de développement.

---

## ✨ Fonctionnalités Actuelles

✅ **Sélection de thème** - Choisissez parmi plusieurs catégories d'images (Nature, Animaux, Voitures, Villes)

✅ **Niveaux de difficulté** - 3 niveaux avec temps limité :
   - Facile : 12 paires (120 secondes)
   - Moyen : 16 paires (130 secondes)  
   - Difficile : 18 paires (140 secondes)

✅ **Images dynamiques** - Récupération en temps réel via l'API Pixabay

✅ **Statistiques en jeu** :
   - Chronomètre en direct
   - Compteur de coups
   - Pourcentage de précision

✅ **Écrans de résultat** - Affichage victoire/défaite avec statistiques finales

✅ **Gestion complète des états** - Changement fluide entre les écrans et les parties

---

## 🛠️ Installation

### Prérequis
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)
- Une connexion internet (pour récupérer les images via Pixabay)

### Étapes

1. **Cloner le repository**
   ```bash
   git clone <votre-repo-url>
   cd java-script/practice
   ```

2. **Ouvrir le projet**
   ```bash
   # Simplement ouvrir index.html dans votre navigateur
   # Ou utiliser un serveur local
   python -m http.server 8000
   # Puis accéder à http://localhost:8000
   ```

---

## 🎮 Utilisation

1. **Lancer le jeu** - Ouvrez `index.html` dans votre navigateur
2. **Sélectionner un thème** - Cliquez sur un bouton de thème (Nature, Animaux, etc.)
3. **Choisir une difficulté** - Sélectionnez le nombre de paires
4. **Cliquer sur "Start Game"** - Le jeu commence !
5. **Appariez les paires** - Trouvez toutes les paires avant la fin du temps

---

## 📁 Structure du Projet

```
📦 practice/
├── 📄 index.html              # Page HTML principale
├── 📄 main.js                 # Point d'entrée JavaScript
├── 📄 style.css               # Styles CSS
├── 📄 README.md               # Ce fichier
│
├── 📁 components/
│   └── 📄 pair.js             # Classes Pair et EachBox (logique du jeu)
│
├── 📁 fonctions/
│   ├── 📄 api.js              # Requêtes API Pixabay
│   └── 📄 dom.js              # Gestion du DOM et des écrans
│
└── 📁 tests/
    ├── 📄 pair.test.js        # Tests unitaires (en cours)
    └── 📄 test.html           # Page de test
```

---

## 🛠️ Technologies Utilisées

- **JavaScript ES6+** - Classes, modules, async/await
- **API Pixabay** - Récupération d'images dynamiques
- **CSS3** - Mise en page responsive
- **DOM API** - Gestion et manipulation du DOM

---

## 🔧 Détails Techniques

### Gestion d'État
- `GameManager` - Contrôle centralisé de l'instance Pair
- Réinitialisation complète sur chaque nouvelle partie
- Nettoyage des event listeners et timers

### Architecture
- **Classes** : `Pair` (logique principale), `EachBox` (gestion des boîtes individuelles)
- **Modules** : Séparation des préoccupations (API, DOM, jeu)
- **Propriétés statiques** : Counters partagés entre les instances de `EachBox`

### Performances
- Lazy loading des images
- Gestion efficace de la mémoire avec `stop()` et cleanup
- Ternarle sur setInterval pour éviter les multiples décompteurs

---

## 📝 Fonctionnalités Futures

- [ ] Sauvegarde des scores/high scores
- [ ] Mode multijoueur
- [ ] Animations/Effets visuels améliorés
- [ ] Mode personnalisé (nombre de paires au choix)
- [ ] Leaderboard
- [ ] Thème sombre
- [ ] Tests unitaires complets

---

## 🐛 Problèmes Connus

- Les images peuvent être lentes à charger en fonction de la connexion
- Pas de système de persistence (scores perdus au rechargement)

---

## 👤 Auteur

Kevin - Développement en cours dans le cadre d'une pratique JavaScript

---

## 📄 Licence

À définir...

---

## 🚀 Démarrage Rapide du Développement

```bash
# Lancer un serveur local
python -m http.server 8000

# Ouvrir les DevTools (F12) pour déboguer
# Console pour voir les logs
# Memory tab pour analyser les fuites mémoire
```

---

**Dernière mise à jour** : Mars 2026
" 
