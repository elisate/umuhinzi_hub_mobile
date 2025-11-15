import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- THEME ---
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeColors, ThemeColors } from "../../constants/theme";

const { width: screenWidth } = Dimensions.get('window');
type Theme = 'light' | 'dark' | 'system';

export default function ProfileScreen() {
  // --- HOOKS ---
  const router = useRouter();
  const { theme, currentTheme } = useTheme(); // Removed unused 'toggleTheme'
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);

  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // --- CLEANED LOGOUT HANDLER ---
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    router.replace("/(auth)/LogIn");
  };

  // --- STATIC DATA ---
  const farmStats = [
    { icon: "land-plots", value: "12.5", label: "Hectares", color: colors.primary },
    { icon: "sprout", value: "4", label: "Crops", color: colors.info },
    { icon: "basket", value: "Mar", label: "Yield", color: colors.warning },
    { icon: "calendar", value: "3", label: "Years", color: colors.gray500 },
  ];

  const mainCrops = [
    { name: "Tomatoes", icon: "food-apple", color: colors.error },
    { name: "Potatoes", icon: "food-variant", color: colors.warning },
    { name: "Maize", icon: "corn", color: colors.success },
    { name: "Cassava", icon: "carrot", color: colors.info },
  ];

  // --- UPDATED: Quick Actions ---
  const quickActions = [
    { icon: "weather-cloudy", label: "Forecast", screen: "/weather" },
    { icon: "sprout", label: "My Crops", screen: "/crops" },
    { icon: "robot", label: "AURA", screen: "/chat" },
    { icon: "camera", label: "Scan Crop", screen: "/scan" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Animated Background */}
      <View style={styles.backgroundOverlay}>
        <Animated.View style={[styles.floatingOrb, styles.orb1]} />
        <Animated.View style={[styles.floatingOrb, styles.orb2]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Profile</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="settings-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* --- UPDATED: Profile Header Card --- */}
          <View style={styles.profileHeaderCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1577221084711-3f49713cbe14?w=150&h=150&fit=crop&crop=face" }}
                  style={styles.profileImage}
                />
                <TouchableOpacity 
                  style={styles.editIcon}
                  onPress={() => setIsEditing(true)}
                >
                  <Ionicons name="camera" size={14} color={colors.background} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Jean Baptiste</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={14} color={colors.primary} />
                  <Text style={styles.profileLocation}>Musanze, Northern Province</Text>
                </View>
                <Text style={styles.memberSince}>Farmer since 2022</Text>
              </View>
            </View>
          </View>

          {/* --- NEW: Farm Overview Card --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farm Overview</Text>
            <View style={styles.statsGrid}>
              {farmStats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                    <MaterialCommunityIcons name={stat.icon as any} size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* --- NEW: Main Crops Card --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Main Crops</Text>
            <View style={styles.cropsContainer}>
              <View style={styles.cropsGrid}>
                {mainCrops.map((crop, index) => (
                  <View key={index} style={styles.cropItem}>
                    <View style={[styles.cropIcon, { backgroundColor: `${crop.color}20` }]}>
                      <MaterialCommunityIcons name={crop.icon as any} size={18} color={crop.color} />
                    </View>
                    <Text style={styles.cropName}>{crop.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>


          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.actionButton}
                  onPress={() => router.push(action.screen as any)}
                >
                  <View style={styles.actionIcon}>
                    <MaterialCommunityIcons name={action.icon as any} size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* --- NEW: Account & Data Section --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account & Data</Text>
            
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => { /* Navigate to Export Data logic */ }}
            >
              <View style={styles.linkLeft}>
                <View style={[styles.linkIcon, { backgroundColor: `${colors.primary}20` }]}>
                  <Ionicons name="download-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.linkText}>Export Farm Data</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => { /* Navigate to Privacy/Terms screen */ }}
            >
              <View style={styles.linkLeft}>
                <View style={[styles.linkIcon, { backgroundColor: `${colors.gray400}20` }]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={colors.gray400} />
                </View>
                <Text style={styles.linkText}>Privacy & Terms</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* --- REVISED: "More" Section --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More</Text>
            
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => router.push('/support')} // Links to support.tsx
            >
              <View style={styles.linkLeft}>
                <View style={[styles.linkIcon, { backgroundColor: `${colors.warning}20` }]}>
                  <Ionicons name="help-circle-outline" size={20} color={colors.warning} />
                </View>
                <Text style={styles.linkText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => router.push('/About')} // Links to About.tsx
            >
              <View style={styles.linkLeft}>
                <View style={[styles.linkIcon, { backgroundColor: `${colors.info}20` }]}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.info} />
                </View>
                <Text style={styles.linkText}>About UmuhinziHub</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* --- REVISED: Logout Button --- */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>UmuhinziHub v1.0.0</Text>
            <Text style={styles.copyright}>© 2025 - Transforming African Agriculture</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="log-out-outline" size={40} color={colors.error} />
            </View>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out? You&apos;ll need to sign in again to use our services.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancel}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirm}
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.modalConfirmText}>Yes, Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- DYNAMIC STYLESHEET ---
const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingOrb: {
    position: "absolute",
    borderRadius: 999,
  },
  orb1: {
    top: "10%",
    right: "-10%",
    width: 150,
    height: 150,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  orb2: {
    bottom: "20%",
    left: "-10%",
    width: 200,
    height: 200,
    backgroundColor: colors.info,
    opacity: 0.08,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 6,
    backgroundColor: `${colors.primary}1A`,
    borderRadius: 8,
  },
  screenTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  settingsButton: {
    padding: 6,
    backgroundColor: `${colors.primary}1A`,
    borderRadius: 8,
  },
  // --- UPDATED: Renamed profileCard to profileHeaderCard
  profileHeaderCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 20, // Added margin top
    marginBottom: 16, // Added margin bottom
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    // removed marginBottom
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.card,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  profileLocation: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 6,
  },
  memberSince: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    // removed marginBottom
  },
  statCard: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },
  // --- UPDATED: Renamed cropsSection to cropsContainer
  cropsContainer: {
    // removed marginTop
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cropsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cropItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.primary}0D`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${colors.primary}1A`,
  },
  cropIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cropName: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.primary}1A`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },
  // --- UPDATED: Renamed settingItem to linkItem ---
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  linkText: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
  },
  // --- REMOVED: exportButton, exportIcon, exportText ---
  
  // --- UPDATED: logoutButton ---
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'transparent', // Changed
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error, // Changed
    gap: 8,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: "600",
  },
  versionContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  versionText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  copyright: {
    color: colors.textSecondary,
    fontSize: 10,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalCancel: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: colors.error,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalConfirmText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});