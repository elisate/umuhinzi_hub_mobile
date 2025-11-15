import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  Modal, // Imported
  Pressable, // Imported
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeColors, ThemeColors } from "../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Crop {
  id: string;
  name: string;
  stage: string;
  nextAction: string;
  actionType: 'water' | 'fertilize' | 'harvest' | 'spray';
  daysLeft: number;
  health: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // --- NEW: Modal States ---
  const [isFabModalVisible, setIsFabModalVisible] = useState(false);
  const [isAddCropModalVisible, setIsAddCropModalVisible] = useState(false);
  
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const { bottom: bottomInset } = useSafeAreaInsets();
  const styles = createStyles(colors, bottomInset);

  // ... (Weather and Crop Data remains the same) ...
  const [weatherData, setWeatherData] = useState({
    temperature: 24,
    condition: 'Partly Cloudy',
    location: 'Musanze, Rwanda',
    code: 'partly-cloudy',
    humidity: 65,
    windSpeed: 12,
  });

  const crops: Crop[] = [
    { id: '1', name: 'Maize', stage: 'Flowering', nextAction: 'Water', actionType: 'water', daysLeft: 2, health: 95 },
    { id: '2', name: 'Beans', stage: 'Vegetative', nextAction: 'Fertilize', actionType: 'fertilize', daysLeft: 1, health: 88 },
    { id: '3', name: 'Coffee', stage: 'Fruiting', nextAction: 'Spray', actionType: 'spray', daysLeft: 3, health: 92 }
  ];


  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setWeatherData(prev => ({
        ...prev,
        temperature: 23 + Math.floor(Math.random() * 5),
      }));
      setRefreshing(false);
      // This alert is fine, it's a temporary confirmation
      Alert.alert('Updated', 'Farm data refreshed!');
    }, 1500);
  };

  // ... (Helper functions getGreeting, getActionIcon, etc. remain the same) ...
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getActionIcon = (type: string, size = 20) => {
    const iconColor = getActionColor(type);
    switch (type) {
      case 'water': return <Ionicons name="water" size={size} color={iconColor} />;
      case 'fertilize': return <MaterialCommunityIcons name="sprout" size={size} color={iconColor} />;
      case 'spray': return <MaterialCommunityIcons name="spray" size={size} color={iconColor} />;
      case 'harvest': return <MaterialCommunityIcons name="corn" size={size} color={iconColor} />;
      default: return <Ionicons name="calendar" size={size} color={iconColor} />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'water': return colors.info;
      case 'fertilize': return colors.warning;
      case 'spray': return colors.primary;
      case 'harvest': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getWeatherIcon = (code: string, size: number, color: string) => {
    switch (code) {
      case 'cloudy': return <Ionicons name="cloudy" size={size} color={color} />;
      case 'rainy': return <Ionicons name="rainy" size={size} color={color} />;
      case 'partly-cloudy': return <Ionicons name="partly-sunny" size={size} color={color} />;
      case 'sunny':
      default:
        return <Ionicons name="sunny" size={size} color={color} />;
    }
  };


  // --- MODIFIED: "Add" button opens the new AddCrop modal ---
  const handleQuickAddCrop = () => {
    setIsAddCropModalVisible(true);
  };

  // --- MODIFIED: FAB press opens the FAB modal ---
  const handleFABPress = () => {
    setIsFabModalVisible(true);
  };
  
  // --- NEW: Re-usable helper to close modal and navigate ---
  const handleModalAction = (modalToClose: 'fab' | 'addCrop', path: string) => {
    if (modalToClose === 'fab') setIsFabModalVisible(false);
    if (modalToClose === 'addCrop') setIsAddCropModalVisible(false);
    
    setTimeout(() => {
      router.push(path);
    }, 150);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ... (Header Bar remains the same) ... */}
      <View style={styles.headerBar}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1577221084711-3f49713cbe14?w=150&h=150&fit=crop&crop=face" }}
            style={styles.profileImage}
          />
          <View style={styles.onlineIndicator} />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.userName}>Jean Baptiste</Text>
        </View>

        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/notifications')}
        >
          <View style={styles.notificationIconContainer}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>


      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ... (Stats, Weather, Crops, Actions, AI, Alert cards remain the same) ... */}
        
        {/* Enhanced Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <MaterialCommunityIcons name="sprout" size={24} color={colors.primary} />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Active Crops</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.warning}15` }]}>
              <Ionicons name="time" size={24} color={colors.warning} />
            </View>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Due Today</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.success}15` }]}>
              <Ionicons name="leaf" size={24} color={colors.success} />
            </View>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
        </View>

        {/* Premium Weather Card */}
        <TouchableOpacity 
          style={styles.weatherCardGradient}
          onPress={() => router.push('/weather')}
          activeOpacity={0.9}
        >
          <View style={styles.weatherCardContent}>
            <View style={styles.weatherLeft}>
              <View style={styles.weatherIconLarge}>
                {getWeatherIcon(weatherData.code, 48, '#ffffff')}
              </View>
              <View style={styles.weatherMainInfo}>
                <Text style={styles.weatherTemp}>{weatherData.temperature}°C</Text>
                <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
                <View style={styles.weatherLocationRow}>
                  <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.weatherLocation}>{weatherData.location}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.weatherRight}>
              <View style={styles.weatherDetail}>
                <Ionicons name="water" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.weatherDetailText}>{weatherData.humidity}%</Text>
              </View>
              <View style={styles.weatherDetail}>
                <MaterialCommunityIcons name="weather-windy" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.weatherDetailText}>{weatherData.windSpeed} km/h</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" style={{ marginTop: 8 }} />
            </View>
          </View>
        </TouchableOpacity>

        {/* My Crops Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Crops</Text>
            <View style={styles.sectionActions}>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleQuickAddCrop} // <-- Connects to Add Crop Modal
              >
                <Ionicons name="add-circle" size={20} color={colors.primary} />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              <Link href="/crops" asChild>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
          
          <View style={styles.cropsList}>
            {crops.map((crop, index) => (
              <TouchableOpacity 
                key={crop.id}
                style={styles.cropCard}
                onPress={() => router.push(`/crops/${crop.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.cropCardHeader}>
                  <View style={styles.cropIconWrapper}>
                    <MaterialCommunityIcons name="sprout" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.cropMainInfo}>
                    <Text style={styles.cropName}>{crop.name}</Text>
                    <Text style={styles.cropStage}>{crop.stage} stage</Text>
                  </View>
                  <View style={styles.healthBadge}>
                    <Ionicons name="fitness" size={14} color={colors.success} />
                    <Text style={styles.healthText}>{crop.health}%</Text>
                  </View>
                </View>
                
                <View style={styles.cropCardFooter}>
                  <View style={[styles.actionBadge, { backgroundColor: `${getActionColor(crop.actionType)}15` }]}>
                    {getActionIcon(crop.actionType, 16)}
                    <Text style={[styles.actionBadgeText, { color: getActionColor(crop.actionType) }]}>
                      {crop.nextAction}
                    </Text>
                  </View>
                  <Text style={styles.daysLeftText}>
                    in {crop.daysLeft} day{crop.daysLeft !== 1 ? 's' : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/scan')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="camera" size={28} color={colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Scan Plant</Text>
              <Text style={styles.quickActionSubtitle}>ID diseases</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/pests')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.error}15` }]}>
                <FontAwesome5 name="bug" size={24} color={colors.error} />
              </View>
              <Text style={styles.quickActionTitle}>Pest Control</Text>
              <Text style={styles.quickActionSubtitle}>Manage pests</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/calendar')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.info}15` }]}>
                <Ionicons name="calendar" size={28} color={colors.info} />
              </View>
              <Text style={styles.quickActionTitle}>Schedule</Text>
              <Text style={styles.quickActionSubtitle}>Plan tasks</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/resources')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.warning}15` }]}>
                <Ionicons name="book" size={28} color={colors.warning} />
              </View>
              <Text style={styles.quickActionTitle}>Resources</Text>
              <Text style={styles.quickActionSubtitle}>Learn more</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Assistant Card */}
        <TouchableOpacity 
          style={styles.aiCard}
          onPress={() => router.push('/chat')}
          activeOpacity={0.9}
        >
          <View style={styles.aiCardContent}>
            <View style={styles.aiIconLarge}>
              <MaterialCommunityIcons name="robot" size={32} color={colors.primary} />
            </View>
            <View style={styles.aiTextContent}>
              <Text style={styles.aiTitle}>AI Farm Assistant</Text>
              <Text style={styles.aiSubtitle}>
                Get instant advice on crop care, pest control, and more
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Alert Card */}
        <TouchableOpacity 
          style={styles.alertCard}
          onPress={() => router.push('/alerts')}
          activeOpacity={0.8}
        >
          <View style={styles.alertIconContainer}>
            <Ionicons name="warning" size={24} color={colors.error} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Disease Alert</Text>
            <Text style={styles.alertText}>
              Leaf rust detected in your area. Check maize crops immediately.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.error} />
        </TouchableOpacity>

        <View style={{ height: 20 }} />

      </ScrollView>

      {/* Enhanced FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleFABPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>

      {/* --- FAB Quick Action Modal --- */}
      <Modal
        visible={isFabModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFabModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsFabModalVisible(false)}
        >
          <Pressable style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Quick Actions</Text>
            
            <TouchableOpacity 
              style={styles.modalAction}
              onPress={() => handleModalAction('fab', '/crops/new')}
            >
              <View style={[styles.modalActionIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="leaf" size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.modalActionText}>Add New Crop</Text>
                <Text style={styles.modalActionSubtitle}>Start tracking a new crop</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalAction}
              onPress={() => handleModalAction('fab', '/activities/new')}
            >
              <View style={[styles.modalActionIcon, { backgroundColor: `${colors.info}15` }]}>
                <Ionicons name="list" size={22} color={colors.info} />
              </View>
              <View>
                <Text style={styles.modalActionText}>Record Activity</Text>
                <Text style={styles.modalActionSubtitle}>Log watering, fertilizing, etc.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalAction, styles.modalActionLast]}
              onPress={() => handleModalAction('fab', '/scan')}
            >
              <View style={[styles.modalActionIcon, { backgroundColor: `${colors.warning}15` }]}>
                <Ionicons name="camera" size={22} color={colors.warning} />
              </View>
              <View>
                <Text style={styles.modalActionText}>Scan Plant</Text>
                <Text style={styles.modalActionSubtitle}>Identify disease or pest</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setIsFabModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* --- NEW: Add Crop Modal --- */}
      <Modal
        visible={isAddCropModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsAddCropModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsAddCropModalVisible(false)}
        >
          <Pressable style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Crop</Text>
            
            <TouchableOpacity 
              style={styles.modalAction}
              onPress={() => handleModalAction('addCrop', '/crops/new')}
            >
              <View style={[styles.modalActionIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="leaf" size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.modalActionText}>Add a New Crop</Text>
                <Text style={styles.modalActionSubtitle}>Start from a blank form</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalAction, styles.modalActionLast]}
              onPress={() => handleModalAction('addCrop', '/crops/templates')}
            >
              <View style={[styles.modalActionIcon, { backgroundColor: `${colors.info}15` }]}>
                <Ionicons name="copy" size={22} color={colors.info} />
              </View>
              <View>
                <Text style={styles.modalActionText}>Use a Template</Text>
                <Text style={styles.modalActionSubtitle}>Start from a saved crop template</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setIsAddCropModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors, bottomInset: number) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.card,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  greetingText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  notificationButton: {
    padding: 4,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.card,
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: "bold",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  weatherCardGradient: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  weatherCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weatherIconLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  weatherMainInfo: {
    flex: 1,
  },
  weatherTemp: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  weatherCondition: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  weatherLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weatherLocation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  weatherRight: {
    alignItems: 'flex-end',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  weatherDetailText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  cropsList: {
    gap: 12,
  },
  cropCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cropCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cropMainInfo: {
    flex: 1,
  },
  cropName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cropStage: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  healthText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: 'bold',
  },
  cropCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  actionBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  daysLeftText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  aiCard: {
    backgroundColor: `${colors.primary}08`,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: `${colors.primary}30`,
    marginBottom: 16,
  },
  aiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aiTextContent: {
    flex: 1,
  },
  aiTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  aiSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  alertCard: {
    backgroundColor: `${colors.error}08`,
    borderColor: `${colors.error}30`,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.error}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
    marginRight: 12,
  },
  alertTitle: {
    color: colors.error,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24 + bottomInset,
    right: 20,
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  // --- Modal Styles (Re-used for both) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: bottomInset + 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalActionLast: {
    borderBottomWidth: 0,
  },
  modalActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalActionText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  modalActionSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  modalCancelButton: {
    backgroundColor: `${colors.primary}15`,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  modalCancelText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});