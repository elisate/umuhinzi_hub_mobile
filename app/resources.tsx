import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  ImageBackground,
  Alert,
  TextInput, // Added TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors, ThemeColors } from '../constants/theme';

// Moved data into a function to make it theme-aware
const createResourcesData = (colors: ThemeColors) => [
  {
    id: '1', title: 'Maize Farming Guide', type: 'guide', category: 'Crops',
    description: 'Complete guide to growing high-yield maize', duration: '15 min read',
    icon: '🌽', color: colors.warning, url: 'https://example.com/maize-guide',
  },
  {
    id: '2', title: 'Organic Pest Control', type: 'article', category: 'Pests',
    description: 'Natural methods to control common farm pests', duration: '8 min read',
    icon: '🐞', color: colors.primary, url: 'https://example.com/organic-pest-control',
  },
  {
    id: '3', title: 'Soil Health Management', type: 'guide', category: 'Soil',
    description: 'Improve your soil quality for better yields', duration: '12 min read',
    icon: '🌱', color: colors.warning, url: 'https://example.com/soil-health', // Mapped brown to warning
  },
  {
    id: '4', title: 'Irrigation Techniques', type: 'video', category: 'Water',
    description: 'Efficient water management for small farms', duration: '20 min watch',
    icon: '💧', color: colors.info, url: 'https://example.com/irrigation-video',
  },
  {
    id: '5', title: 'Market Access Strategies', type: 'article', category: 'Business',
    description: 'How to get better prices for your produce', duration: '10 min read',
    icon: '💰', color: colors.primary, url: 'https.example.com/market-access',
  },
  {
    id: '6', title: 'Climate Smart Agriculture', type: 'guide', category: 'Climate',
    description: 'Adapting to changing weather patterns', duration: '18 min read',
    icon: '🌍', color: colors.info, url: 'https.example.com/climate-smart',
  },
];

const createCategoriesData = (resources: any[]) => [
  { id: 'all', name: 'All', icon: '📚', count: resources.length }, // Shortened name
  { id: 'Crops', name: 'Crops', icon: '🌽', count: resources.filter(r => r.category === 'Crops').length },
  { id: 'Pests', name: 'Pests', icon: '🐛', count: resources.filter(r => r.category === 'Pests').length },
  { id: 'Soil', name: 'Soil', icon: '🌱', count: resources.filter(r => r.category === 'Soil').length },
  { id: 'Water', name: 'Water', icon: '💧', count: resources.filter(r => r.category === 'Water').length },
  { id: 'Business', name: 'Business', icon: '💰', count: resources.filter(r => r.category === 'Business').length },
];

export default function ResourcesScreen() {
  const router = useRouter();

  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  // --- THEME-AWARE DATA ---
  const resources = createResourcesData(colors);
  const categories = createCategoriesData(resources);
  // ---

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleResourcePress = async (resource: any) => {
    try {
      const supported = await Linking.canOpenURL(resource.url);
      if (supported) {
        await Linking.openURL(resource.url);
      } else {
        Alert.alert('Error', `Cannot open this link.`);
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
      Alert.alert('Error', 'An error occurred while trying to open the link.');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return '📖';
      case 'article': return '📄';
      case 'video': return '🎥';
      default: return '📚';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Farming Resources</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Learn & Grow</Text>
            <Text style={styles.heroSubtitle}>
              Access expert farming knowledge and improve your skills
            </Text>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="library" size={40} color={colors.primary} />
          </View>
        </View>

        {/* Search Bar - Added as implied by state */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            <View style={styles.categories}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryName,
                    selectedCategory === category.id && styles.categoryNameActive,
                  ]}>
                    {category.name}
                  </Text>
                  <Text style={[
                    styles.categoryCount,
                    selectedCategory === category.id && styles.categoryCountActive,
                  ]}>
                    {category.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Resources Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'All Resources' : `${selectedCategory} Resources`}
            </Text>
            <Text style={styles.resourceCount}>
              {filteredResources.length} {filteredResources.length === 1 ? 'item' : 'items'}
            </Text>
          </View>

          {filteredResources.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={colors.border} />
              <Text style={styles.emptyTitle}>No Resources Found</Text>
              <Text style={styles.emptyDescription}>
                Try selecting a different category or adjusting your search.
              </Text>
            </View>
          ) : (
            <View style={styles.resourcesGrid}>
              {filteredResources.map((resource) => (
                <TouchableOpacity
                  key={resource.id}
                  style={styles.resourceCard}
                  onPress={() => handleResourcePress(resource)}
                >
                  <View style={[ styles.resourceIcon, { backgroundColor: `${resource.color}33` } ]}>
                    <Text style={styles.resourceEmoji}>{resource.icon}</Text>
                  </View>
                  <View style={styles.resourceType}>
                    <Text style={styles.typeIcon}>{getTypeIcon(resource.type)}</Text>
                    <Text style={styles.resourceTypeText}>{resource.type}</Text>
                  </View>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceDescription}>{resource.description}</Text>
                  <View style={styles.resourceMeta}>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{resource.category}</Text>
                    </View>
                    <Text style={styles.resourceDuration}>{resource.duration}</Text>
                  </View>
                  <View style={styles.resourceAction}>
                    <Text style={styles.resourceActionText}>
                      {resource.type === 'video' ? 'Watch Video' : 'Read More'}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Video Tutorials Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="play-circle-outline" size={18} color={colors.primary} /> Video Tutorials
          </Text>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.videoCard}>
              <ImageBackground
                style={[styles.videoThumbnail, { backgroundColor: colors.gray200 }]}
              >
                <Ionicons name="play-circle" size={40} color={colors.white} />
                <Text style={styles.videoDuration}>2:40</Text>
              </ImageBackground>
              <Text style={styles.videoTitle}>Composting Basics</Text>
              <Text style={styles.videoDescription}>Build healthy soil.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoCard}>
              <ImageBackground
                style={[styles.videoThumbnail, { backgroundColor: colors.gray300 }]}
              >
                <Ionicons name="play-circle" size={40} color={colors.white} />
                <Text style={styles.videoDuration}>1:28</Text>
              </ImageBackground>
              <Text style={styles.videoTitle}>Transplanting Tips</Text>
              <Text style={styles.videoDescription}>Ensuring healthy growth.</Text>
            </TouchableOpacity>
            {/* ... add more themed video cards as needed ... */}
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredCard}>
            <View style={styles.featuredHeader}>
              <View style={styles.featuredIcon}>
                <Ionicons name="sparkles" size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.featuredTitle}>AURA Farming Tips</Text>
                <Text style={styles.featuredSubtitle}>Weekly expert advice</Text>
              </View>
            </View>
            <View style={styles.featuredTips}>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.tipText}>Water plants early morning to reduce evaporation</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.tipText}>Rotate crops to prevent soil nutrient depletion</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.askAuraButton}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color={colors.background} />
              <Text style={styles.askAuraText}>Get More Tips from AURA</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Government Resources */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Government Resources</Text>
          <Text style={styles.cardSubtitle}>Official agricultural programs and support</Text>
          <View style={styles.govLinks}>
            <TouchableOpacity style={styles.govLink}>
              <Ionicons name="document-text" size={20} color={colors.info} />
              <View style={styles.govLinkInfo}>
                <Text style={styles.govLinkTitle}>Subsidy Programs</Text>
                <Text style={styles.govLinkDesc}>Farming input subsidies and support</Text>
              </View>
              <Ionicons name="open-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.govLink}>
              <Ionicons name="school" size={20} color={colors.primary} />
              <View style={styles.govLinkInfo}>
                <Text style={styles.govLinkTitle}>Training Programs</Text>
                <Text style={styles.govLinkDesc}>Free farming workshops and courses</Text>
              </View>
              <Ionicons name="open-outline" size={20} color={colors.textSecondary} />
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
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
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
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  resourceCount: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  categoriesScroll: {
    marginHorizontal: -15,
    paddingHorizontal: 15,
  },
  categories: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: `${colors.primary}33`,
    borderColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  categoryName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryNameActive: {
    color: colors.primary,
  },
  categoryCount: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  categoryCountActive: {
    color: colors.primary,
  },
  resourcesGrid: {
    gap: 15,
  },
  resourceCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resourceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  resourceEmoji: {
    fontSize: 20,
  },
  resourceType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  typeIcon: {
    fontSize: 12,
  },
  resourceTypeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  resourceTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 20,
  },
  resourceDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 18,
  },
  resourceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: `${colors.primary}33`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  resourceDuration: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  resourceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resourceActionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
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
  featuredSection: {
    marginBottom: 20,
  },
  featuredCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: `${colors.primary}4D`,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuredIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}33`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featuredTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  featuredSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  featuredTips: {
    gap: 12,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  askAuraButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  askAuraText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
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
    marginBottom: 8,
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 15,
  },
  govLinks: {
    gap: 12,
  },
  govLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  govLinkInfo: {
    flex: 1,
  },
  govLinkTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  govLinkDesc: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  videoCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12, // Added margin
  },
  videoThumbnail: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: colors.gray200, // Themed placeholder
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: `${colors.black}B3`, // 70% opacity black
    color: colors.white,
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    padding: 12,
    paddingBottom: 4,
  },
  videoDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    padding: 12,
    paddingTop: 0,
  },
});