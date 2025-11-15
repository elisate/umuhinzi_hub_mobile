import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput, // Added TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext'; // Adjust path
import { getThemeColors, ThemeColors } from '../constants/theme'; // Adjust path

// Moved data into a function to make it theme-aware
const createPestsData = (colors: ThemeColors) => [
  {
    id: '1', name: 'Fall Armyworm', scientificName: 'Spodoptera frugiperda',
    crops: ['Maize', 'Sorghum', 'Rice'], severity: 'High',
    description: 'Larvae feed on leaves, causing extensive damage to crops.',
    symptoms: ['Holes in leaves', 'Leaf skeletonization', 'Frass deposits'],
    treatment: ['Use neem oil', 'Apply biological pesticides', 'Practice crop rotation'],
    prevention: ['Early planting', 'Field monitoring', 'Use resistant varieties'],
    image: '🪲', color: colors.error,
  },
  {
    id: '2', name: 'Bean Fly', scientificName: 'Ophiomyia phaseoli',
    crops: ['Beans', 'Peas'], severity: 'Medium',
    description: 'Larvae tunnel into stems, causing wilting and plant death.',
    symptoms: ['Leaf yellowing', 'Stem tunneling', 'Plant wilting'],
    treatment: ['Soil drenching', 'Use of insecticides', 'Remove infected plants'],
    prevention: ['Proper field hygiene', 'Early planting', 'Use healthy seeds'],
    image: '🐛', color: colors.warning,
  },
  {
    id: '3', name: 'Coffee Berry Borer', scientificName: 'Hypothenemus hampei',
    crops: ['Coffee'], severity: 'High',
    description: 'Small beetle that bores into coffee berries, reducing yield and quality.',
    symptoms: ['Small holes in berries', 'Berry drop', 'Reduced quality'],
    treatment: ['Beauveria bassiana fungus', 'Proper harvesting', 'Field sanitation'],
    prevention: ['Shade management', 'Timely harvesting', 'Biological control'],
    image: '☕', color: colors.error, // Mapped brown to error
  },
  {
    id: '4', name: 'Aphids', scientificName: 'Aphidoidea',
    crops: ['Various vegetables', 'Fruits'], severity: 'Medium',
    description: 'Small sap-sucking insects that can transmit plant viruses.',
    symptoms: ['Curled leaves', 'Honeydew secretion', 'Sooty mold'],
    treatment: ['Insecticidal soap', 'Neem oil', 'Ladybird beetles'],
    prevention: ['Companion planting', 'Reflective mulches', 'Natural predators'],
    image: '🐜', color: colors.info,
  },
];

export default function PestsScreen() {
  const router = useRouter();
  
  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  // --- THEME-AWARE DATA ---
  const pestsData = createPestsData(colors);
  // ---
  
  const [selectedPest, setSelectedPest] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPests = pestsData.filter(pest =>
    pest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pest.crops.some(crop => crop.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const PestCard = ({ pest }: { pest: any }) => (
    <TouchableOpacity
      style={styles.pestCard}
      onPress={() => setSelectedPest(selectedPest === pest.id ? null : pest.id)}
    >
      <View style={styles.pestHeader}>
        <View style={styles.pestIconContainer}>
          <Text style={styles.pestIcon}>{pest.image}</Text>
        </View>
        <View style={styles.pestInfo}>
          <Text style={styles.pestName}>{pest.name}</Text>
          <Text style={styles.pestScientific}>{pest.scientificName}</Text>
          <View style={styles.cropTags}>
            {pest.crops.map((crop, index) => (
              <View key={index} style={styles.cropTag}>
                <Text style={styles.cropTagText}>{crop}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: `${pest.color}26` }]}>
          <Text style={[styles.severityText, { color: pest.color }]}>
            {pest.severity}
          </Text>
        </View>
      </View>

      {selectedPest === pest.id && (
        <View style={styles.pestDetails}>
          <Text style={styles.detailTitle}>Description</Text>
          <Text style={styles.detailText}>{pest.description}</Text>

          <Text style={styles.detailTitle}>Symptoms</Text>
          {pest.symptoms.map((symptom, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
              <Text style={styles.listText}>{symptom}</Text>
            </View>
          ))}

          <Text style={styles.detailTitle}>Treatment</Text>
          {pest.treatment.map((treatment, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="medical-outline" size={16} color={colors.primary} />
              <Text style={styles.listText}>{treatment}</Text>
            </View>
          ))}

          <Text style={styles.detailTitle}>Prevention</Text>
          {pest.prevention.map((prevention, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.info} />
              <Text style={styles.listText}>{prevention}</Text>
            </View>
          ))}

          <TouchableOpacity 
            style={styles.askAuraButton}
            onPress={() => router.push('/(tabs)/chat')} // Corrected path
          >
            <Ionicons name="chatbubble-ellipses" size={20} color={colors.background} />
            <Text style={styles.askAuraText}>Ask AURA About {pest.name}</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pest & Disease Control</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Protect Your Crops</Text>
            <Text style={styles.heroSubtitle}>
              Identify pests and diseases with AURA&apos;s expert guidance
            </Text>
          </View>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="bug" size={40} color={colors.primary} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/scan')} // Corrected path
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}33` }]}>
              <Ionicons name="camera" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Scan Plant</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/chat')} // Corrected path
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.info}33` }]}>
              <Ionicons name="chatbubble-ellipses" size={24} color={colors.info} />
            </View>
            <Text style={styles.quickActionText}>Ask AURA</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/emergency')}  // Corrected path
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.error}33` }]}>
              <Ionicons name="warning" size={24} color={colors.error} />
            </View>
            <Text style={styles.quickActionText}>Emergency</Text>
          </TouchableOpacity>
        </View>

        {/* Pest Library */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Pests & Diseases</Text>
          <Text style={styles.sectionSubtitle}>
            Tap on any pest to see detailed information and treatment options
          </Text>

          {/* Search Bar - Added as it was implied by state */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search pests or crops..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {filteredPests.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.border} />
              <Text style={styles.emptyTitle}>No Pests Found</Text>
              <Text style={styles.emptyDescription}>Try adjusting your search query.</Text>
            </View>
          ) : (
            filteredPests.map((pest) => (
              <PestCard key={pest.id} pest={pest} />
            ))
          )}
        </View>

        {/* Prevention Tips */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prevention Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="eye" size={20} color={colors.primary} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Regular Monitoring</Text>
                <Text style={styles.tipDescription}>Inspect crops weekly for early signs</Text>
              </View>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="leaf" size={20} color={colors.primary} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Crop Rotation</Text>
                <Text style={styles.tipDescription}>Rotate crops to break pest cycles</Text>
              </View>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="water" size={20} color={colors.primary} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Proper Watering</Text>
                <Text style={styles.tipDescription}>Avoid overwatering to prevent fungi</Text>
              </View>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="trash" size={20} color={colors.primary} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Field Sanitation</Text>
                <Text style={styles.tipDescription}>Remove crop residues and weeds</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.primary}33`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pestCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pestIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pestIcon: {
    fontSize: 24,
  },
  pestInfo: {
    flex: 1,
  },
  pestName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  pestScientific: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  cropTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cropTag: {
    backgroundColor: `${colors.primary}33`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cropTagText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pestDetails: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  listText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  askAuraButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  askAuraText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});