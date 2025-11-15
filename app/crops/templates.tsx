import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors, ThemeColors } from '../../constants/theme';

export default function CropTemplatesScreen() {
  const router = useRouter();

  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  // --- THEME-AWARE DATA ---
  // Moved inside component to access 'colors'
  const cropTemplates = [
    {
      id: '1',
      name: 'Maize Farming',
      description: 'High-yield maize production template',
      duration: '90-120 days',
      season: 'Rainy Season',
      difficulty: 'Beginner',
      icon: '🌽',
      color: colors.warning, // Was '#FCD34D'
    },
    {
      id: '2',
      name: 'Beans Cultivation',
      description: 'Traditional beans farming guide',
      duration: '60-90 days',
      season: 'All Seasons',
      difficulty: 'Beginner',
      icon: '🫘',
      color: colors.primary, // Was '#00FF88'
    },
    {
      id: '3',
      name: 'Coffee Plantation',
      description: 'Premium coffee growing template',
      duration: '3-4 years',
      season: 'Year-round',
      difficulty: 'Expert',
      icon: '☕',
      color: colors.warning, // Was '#8B4513' (Brown) -> mapped to warning
    },
    {
      id: '4',
      name: 'Vegetable Garden',
      description: 'Mixed vegetable garden setup',
      duration: '45-60 days',
      season: 'All Seasons',
      difficulty: 'Beginner',
      icon: '🥬',
      color: colors.primary, // Was '#00FF88'
    },
    {
      id: '5',
      name: 'Banana Plantation',
      description: 'Commercial banana farming',
      duration: '9-12 months',
      season: 'Year-round',
      difficulty: 'Intermediate',
      icon: '🍌',
      color: colors.warning, // Was '#FCD34D'
    },
    {
      id: '6',
      name: 'Potato Farming',
      description: 'High-density potato cultivation',
      duration: '75-100 days',
      season: 'Cool Season',
      difficulty: 'Intermediate',
      icon: '🥔',
      color: colors.warning, // Was '#F97316' (Orange) -> mapped to warning
    },
  ];
  // ---

  const handleTemplateSelect = (template: any) => {
    router.push({
      pathname: '/crops/newCrop',
      params: { template: template.name }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Templates</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Start Smart with AURA</Text>
          <Text style={styles.heroSubtitle}>
            Choose from proven farming templates optimized for your region
          </Text>
        </View>

        <View style={styles.templatesGrid}>
          {cropTemplates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => handleTemplateSelect(template)}
            >
              <View style={[styles.templateIcon, { backgroundColor: `${template.color}33` }]}>
                <Text style={styles.iconEmoji}>{template.icon}</Text>
              </View>
              
              <View style={styles.templateContent}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription}>{template.description}</Text>
                
                <View style={styles.templateMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{template.duration}</Text>
                  </View>
                  
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{template.season}</Text>
                  </View>
                </View>

                <View style={[styles.difficultyBadge, { 
                  backgroundColor: template.difficulty === 'Beginner' ? `${colors.primary}33` :
                                 template.difficulty === 'Intermediate' ? `${colors.warning}33`
                                 : `${colors.error}33`
                }]}>
                  <Text style={[styles.difficultyText, {
                    color: template.difficulty === 'Beginner' ? colors.primary :
                           template.difficulty === 'Intermediate' ? colors.warning
                           : colors.error
                  }]}>
                    {template.difficulty}
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customSection}>
          <View style={styles.customCard}>
            <Ionicons name="build-outline" size={32} color={colors.primary} />
            <Text style={styles.customTitle}>Custom Template</Text>
            <Text style={styles.customDescription}>
              Create your own farming template from scratch
            </Text>
            <TouchableOpacity 
              style={styles.customButton}
              onPress={() => router.push('/crops/newCrop')}
            >
              <Text style={styles.customButtonText}>Create Custom</Text>
            </TouchableOpacity>
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  templatesGrid: {
    gap: 12,
    marginBottom: 20,
  },
  templateCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  templateIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconEmoji: {
    fontSize: 24,
  },
  templateContent: {
    flex: 1,
  },
  templateName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  templateDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  templateMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  customSection: {
    marginBottom: 30,
  },
  customCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: `${colors.primary}4D`, // 0.3 opacity
    borderStyle: 'dashed',
  },
  customTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  customDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  customButton: {
    backgroundColor: `${colors.primary}33`, // 0.2 opacity
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  customButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});