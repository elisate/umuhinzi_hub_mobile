import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext'; // Standardized path
import { getThemeColors, ThemeColors } from '../constants/theme'; // Standardized path

// --- Interface for type safety ---
interface ThemeOption {
  value: 'light' | 'dark' | 'system';
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

// --- Data moved outside component ---
const themeOptions: ThemeOption[] = [
  { value: 'light' as const, label: 'Light Mode', icon: 'sunny' },
  { value: 'dark' as const, label: 'Dark Mode', icon: 'moon' },
  { value: 'system' as const, label: 'System Default', icon: 'phone-portrait' },
];

export default function SettingsScreen() {
  const router = useRouter();
  // Removed unused `toggleTheme`
  const { theme, currentTheme, setTheme } = useTheme(); 
  const colors = getThemeColors(currentTheme);

  const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'system') => {
    setTheme(selectedTheme);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all your crops, activities, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => {
            // Implement data clearing logic here
            Alert.alert('Success', 'All data has been cleared');
          }
        },
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Theme Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <Text style={styles.sectionSubtitle}>Choose how AURA looks</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Theme</Text>
            <Text style={styles.cardSubtitle}>
              Current: {theme === 'system' ? 'System Default' : `${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode`}
            </Text>
            
            <View style={styles.themeOptions}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    theme === option.value && styles.themeOptionSelected,
                  ]}
                  onPress={() => handleThemeSelect(option.value)}
                >
                  <View style={[
                    styles.themeIcon,
                    { backgroundColor: `${colors.primary}33` } // 20% opacity
                  ]}>
                    <Ionicons 
                      name={option.icon} // No 'as any' needed
                      size={20} 
                      color={colors.primary} 
                    />
                  </View>
                  <Text style={[
                    styles.themeLabel,
                    theme === option.value && styles.themeLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                  {theme === option.value && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.themePreview}>
              <Text style={styles.previewTitle}>Preview</Text>
              <View style={[
                styles.previewCard,
                { backgroundColor: colors.card }
              ]}>
                <View style={styles.previewHeader}>
                  <View style={[
                    styles.previewIcon,
                    { backgroundColor: `${colors.primary}33` } // 20% opacity
                  ]}>
                    <Ionicons name="leaf" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.previewText}>
                    <Text style={[styles.previewTextMain, { color: colors.text }]}>
                      AURA Assistant
                    </Text>
                    <Text style={[styles.previewTextSub, { color: colors.textSecondary }]}>
                      Ready to help with your farm
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.previewButton,
                  { backgroundColor: colors.primary }
                ]}>
                  {/* Use background color for text on light button */}
                  <Text style={[styles.previewButtonText, { color: currentTheme === 'dark' ? colors.background : colors.white }]}>Get Started</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={20} color={colors.primary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive alerts and reminders</Text>
                </View>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.gray300, true: `${colors.primary}80` }} // 50% opacity
                thumbColor={colors.primary}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="water" size={20} color={colors.info} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Watering Reminders</Text>
                  <Text style={styles.settingDescription}>Get notified when to water crops</Text>
                </View>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.gray300, true: `${colors.info}80` }} // 50% opacity
                thumbColor={colors.info}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="warning" size={20} color={colors.warning} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Disease Alerts</Text>
                  <Text style={styles.settingDescription}>Pest and disease warnings</Text>
                </View>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.gray300, true: `${colors.warning}80` }} // 50% opacity
                thumbColor={colors.warning}
              />
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          
          <View style={styles.card}>
            <TouchableOpacity style={styles.dataItem}>
              <View style={styles.dataInfo}>
                <Ionicons name="cloud-download" size={20} color={colors.info} />
                <View style={styles.dataText}>
                  <Text style={styles.dataTitle}>Backup Data</Text>
                  <Text style={styles.dataDescription}>Save your farm data to cloud</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.dataItem}>
              <View style={styles.dataInfo}>
                <Ionicons name="cloud-upload" size={20} color={colors.success} />
                <View style={styles.dataText}>
                  <Text style={styles.dataTitle}>Restore Data</Text>
                  <Text style={styles.dataDescription}>Recover from previous backup</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.dataItem, styles.dataItemNoBorder]}
              onPress={handleClearData}
            >
              <View style={styles.dataInfo}>
                <Ionicons name="trash" size={20} color={colors.error} />
                <View style={styles.dataText}>
                  <Text style={[styles.dataTitle, { color: colors.error }]}>
                    Clear All Data
                  </Text>
                  <Text style={styles.dataDescription}>
                    Remove all crops, activities, and settings
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About AURA</Text>
          
          <View style={styles.card}>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Build Number</Text>
              <Text style={styles.aboutValue}>2024.06.001</Text>
            </View>
            
            <View style={[styles.aboutItem, styles.dataItemNoBorder]}>
              <Text style={styles.aboutLabel}>Last Updated</Text>
              <Text style={styles.aboutValue}>June 15, 2024</Text>
            </View>

            <TouchableOpacity style={[styles.aboutLink, { paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Text style={styles.aboutLinkText}>Privacy Policy</Text>
              <Ionicons name="open-outline" size={16} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.aboutLink}>
              <Text style={styles.aboutLinkText}>Terms of Service</Text>
              <Ionicons name="open-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for farmers worldwide
          </Text>
          <Text style={styles.footerSubtext}>
            AURA Farming Assistant © 2024
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Theme-aware StyleSheet function ---
const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 34,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
  },
  themeOptions: {
    gap: 12,
    marginBottom: 20,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background, // Changed from gray50 to background for better contrast
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  themeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}1A`, // 10% opacity
  },
  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  themeLabelSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  themePreview: {
    marginTop: 8,
  },
  previewTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewText: {
    flex: 1,
  },
  previewTextMain: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  previewTextSub: {
    fontSize: 14,
  },
  previewButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewButtonText: {
    // color set in-line based on theme
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dataItemNoBorder: {
    borderBottomWidth: 0,
  },
  dataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dataText: {
    flex: 1,
  },
  dataTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  dataDescription: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aboutLabel: {
    color: colors.text,
    fontSize: 16,
  },
  aboutValue: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  aboutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  aboutLinkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 4,
  },
  footerSubtext: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});