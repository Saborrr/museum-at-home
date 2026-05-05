import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import COLLECTION from '../data/collection.json';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Ken Burns animation variants
const KEN_BURNS = [
  // zoom in + pan right
  { from: { scale: 1.0, x: 0, y: 0 }, to: { scale: 1.15, x: -30, y: -15 } },
  // zoom out + pan left
  { from: { scale: 1.12, x: -30, y: 0 }, to: { scale: 1.0, x: 20, y: 15 } },
  // zoom in from top
  { from: { scale: 1.0, x: 0, y: 20 }, to: { scale: 1.18, x: -15, y: -10 } },
  // zoom out bottom-right
  { from: { scale: 1.15, x: 20, y: -10 }, to: { scale: 1.0, x: -10, y: 15 } },
  // pan left to right
  { from: { scale: 1.08, x: -40, y: 0 }, to: { scale: 1.12, x: 40, y: 0 } },
  // slow zoom center
  { from: { scale: 1.0, x: 0, y: 0 }, to: { scale: 1.2, x: 0, y: 0 } },
];

const INTERVALS = [
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '2m', value: 120 },
  { label: '5m', value: 300 },
];

export default function App() {
  const [artworks, setArtworks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [infoVisible, setInfoVisible] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [interval, setInterval_] = useState(30);
  const [showInfoMode, setShowInfoMode] = useState('always'); // always, brief, never
  const [favorites, setFavorites] = useState({});
  const [showFavHint, setShowFavHint] = useState(false);
  const [favHintText, setFavHintText] = useState('');

  // Ken Burns animation
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  // Load settings
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('screensaver_settings');
        if (saved) {
          const s = JSON.parse(saved);
          if (s.interval) setInterval_(s.interval);
          if (s.showInfo) setShowInfoMode(s.showInfo);
        }
        const favs = await AsyncStorage.getItem('screensaver_favorites');
        if (favs) setFavorites(JSON.parse(favs));
      } catch (e) {}

      // Load collection
      const arts = COLLECTION.artworks || [];
      const shuffled = shuffleArray(arts);
      setArtworks(shuffled);
      setLoading(false);
    })();
  }, []);

  // Lock to landscape
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => ScreenOrientation.unlockAsync();
  }, []);

  // Clock
  const [clock, setClock] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Ken Burns animation
  const animateKenBurns = useCallback(() => {
    const variant = KEN_BURNS[Math.floor(Math.random() * KEN_BURNS.length)];
    scaleAnim.setValue(variant.from.scale);
    translateXAnim.setValue(variant.from.x);
    translateYAnim.setValue(variant.from.y);

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: variant.to.scale,
        duration: interval * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
        toValue: variant.to.x,
        duration: interval * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: variant.to.y,
        duration: interval * 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [interval, currentIndex]);

  // Show artwork with fade-in
  useEffect(() => {
    if (artworks.length === 0) return;
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    animateKenBurns();

    // Show info briefly
    if (showInfoMode === 'brief') {
      setInfoVisible(true);
      const t = setTimeout(() => setInfoVisible(false), 5000);
      return () => clearTimeout(t);
    } else if (showInfoMode === 'never') {
      setInfoVisible(false);
    } else {
      setInfoVisible(true);
    }
  }, [currentIndex, showInfoMode]);

  // Auto-advance timer
  useEffect(() => {
    if (artworks.length === 0) return;
    timerRef.current = setInterval(() => {
      nextArtwork();
    }, interval * 1000);
    return () => clearInterval(timerRef.current);
  }, [artworks, interval]);

  const nextArtwork = () => {
    setCurrentIndex((i) => (i + 1) % artworks.length);
  };

  const prevArtwork = () => {
    setCurrentIndex((i) => (i - 1 + artworks.length) % artworks.length);
  };

  const toggleFavorite = async () => {
    const art = artworks[currentIndex];
    if (!art) return;
    const newFavs = { ...favorites };
    if (newFavs[art.id]) {
      delete newFavs[art.id];
      setFavHintText('💔 Removed');
    } else {
      newFavs[art.id] = true;
      setFavHintText('❤️ Saved!');
    }
    setFavorites(newFavs);
    setShowFavHint(true);
    setTimeout(() => setShowFavHint(false), 1500);
    await AsyncStorage.setItem('screensaver_favorites', JSON.stringify(newFavs));
  };

  const saveSettings = async (newInterval, newShowInfo) => {
    setInterval_(newInterval);
    setShowInfoMode(newShowInfo);
    await AsyncStorage.setItem(
      'screensaver_settings',
      JSON.stringify({ interval: newInterval, showInfo: newShowInfo })
    );
  };

  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading art...</Text>
      </View>
    );
  }

  const art = artworks[currentIndex];
  if (!art) return null;

  const isFav = !!favorites[art.id];
  const favCount = Object.keys(favorites).length;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Main Image with Ken Burns */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: translateXAnim },
              { translateY: translateYAnim },
            ],
          },
        ]}
      >
        <Animated.Image
          source={{ uri: art.image }}
          style={[styles.image, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Clock */}
      <Text style={styles.clock}>{clock}</Text>

      {/* Favorites badge */}
      <TouchableOpacity style={styles.favBadge} onPress={toggleFavorite}>
        <Text style={styles.favBadgeText}>
          {isFav ? '❤️' : '🤍'} {favCount}
        </Text>
      </TouchableOpacity>

      {/* Favorite hint popup */}
      {showFavHint && (
        <View style={styles.favHint}>
          <Text style={styles.favHintText}>{favHintText}</Text>
        </View>
      )}

      {/* Art Info */}
      {infoVisible && (
        <Animated.View style={[styles.infoPanel, { opacity: fadeAnim }]}>
          <Text style={styles.artTitle}>{art.title}</Text>
          <Text style={styles.artArtist}>{art.artist}</Text>
          <Text style={styles.artMeta}>
            {art.year}
            {art.year ? ' • ' : ''}
            {art.museum}
          </Text>
        </Animated.View>
      )}

      {/* Navigation buttons (tap zones) */}
      <TouchableOpacity style={styles.navLeft} onPress={prevArtwork} />
      <TouchableOpacity style={styles.navRight} onPress={nextArtwork} />
      <TouchableOpacity style={styles.navTop} onPress={toggleFavorite} />
      <TouchableOpacity
        style={styles.navBottom}
        onPress={() => {
          setInfoVisible(true);
          setTimeout(() => {
            if (showInfoMode === 'brief' || showInfoMode === 'never')
              setInfoVisible(false);
          }, 5000);
        }}
      />

      {/* Settings overlay */}
      {showSettings && (
        <View style={styles.settingsOverlay}>
          <Text style={styles.settingsTitle}>⚙️ Settings</Text>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Interval</Text>
            <View style={styles.settingsOptions}>
              {INTERVALS.map((int) => (
                <TouchableOpacity
                  key={int.value}
                  style={[
                    styles.settingsBtn,
                    interval === int.value && styles.settingsBtnActive,
                  ]}
                  onPress={() => saveSettings(int.value, showInfoMode)}
                >
                  <Text style={styles.settingsBtnText}>{int.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Show Info</Text>
            <View style={styles.settingsOptions}>
              {['always', 'brief', 'never'].map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.settingsBtn,
                    showInfoMode === mode && styles.settingsBtnActive,
                  ]}
                  onPress={() => saveSettings(interval, mode)}
                >
                  <Text style={styles.settingsBtnText}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.settingsClose}
            onPress={() => setShowSettings(false)}
          >
            <Text style={styles.settingsCloseText}>✕ Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Settings trigger (long press center) */}
      {!showSettings && (
        <TouchableOpacity
          style={styles.settingsTrigger}
          onLongPress={() => setShowSettings(true)}
          delayLongPress={500}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_W + 100,
    height: SCREEN_H + 100,
  },
  clock: {
    position: 'absolute',
    top: 20,
    right: 30,
    fontSize: 36,
    fontWeight: '300',
    color: '#fff',
    opacity: 0.4,
    fontFamily: 'Helvetica Neue',
  },
  favBadge: {
    position: 'absolute',
    top: 20,
    left: 30,
  },
  favBadgeText: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.5,
  },
  favHint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, translateY: -50 }],
  },
  favHintText: {
    fontSize: 48,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    padding: 20,
    backgroundColor: 'transparent',
  },
  artTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  artArtist: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 2,
  },
  artMeta: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  // Navigation tap zones (invisible)
  navLeft: {
    position: 'absolute',
    left: 0,
    top: '30%',
    width: '25%',
    height: '40%',
  },
  navRight: {
    position: 'absolute',
    right: 0,
    top: '30%',
    width: '25%',
    height: '40%',
  },
  navTop: {
    position: 'absolute',
    top: 0,
    left: '25%',
    width: '50%',
    height: '30%',
  },
  navBottom: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    width: '50%',
    height: '20%',
  },
  settingsTrigger: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    width: '20%',
    height: '20%',
  },
  // Settings
  settingsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  settingsTitle: {
    fontSize: 36,
    color: '#fff',
    marginBottom: 40,
    fontWeight: '300',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
    maxWidth: 600,
  },
  settingsLabel: {
    fontSize: 22,
    color: '#fff',
    width: 120,
    fontWeight: '500',
  },
  settingsOptions: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  settingsBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingsBtnActive: {
    backgroundColor: 'rgba(100,140,255,0.4)',
    borderColor: 'rgba(100,140,255,0.8)',
  },
  settingsBtnText: {
    fontSize: 18,
    color: '#fff',
  },
  settingsClose: {
    marginTop: 30,
  },
  settingsCloseText: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.5)',
  },
  loading: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    opacity: 0.6,
    marginTop: 15,
  },
});
