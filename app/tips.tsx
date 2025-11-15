import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  ImageBackground,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors, ThemeColors } from '../constants/theme'; 

type Category = "All" | "Planting" | "Pest Control" | "Post-harvest" | "Soil Care" | "Irrigation";

export default function TipsAndGuidesScreen() {
  const router = useRouter();
  
  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [prePlantingChecklist, setPrePlantingChecklist] = useState({
    phLevel: false, soilTest: false, cropRotation: false, seedSelection: false,
  });
  const [pestMonitoringChecklist, setPestMonitoringChecklist] = useState({
    dailyCheck: false, recordTypes: false, applyTreatment: false, monitorTraps: false,
  });

  const toggleSaved = (id: string) => {
    const newSaved = new Set(savedItems);
    newSaved.has(id) ? newSaved.delete(id) : newSaved.add(id);
    setSavedItems(newSaved);
  };

  const getCompletedCount = (checklist: any) => Object.values(checklist).filter(Boolean).length;
  const getTotalCount = (checklist: any) => Object.keys(checklist).length;

  const handleChecklistChange = (checklist: any, setChecklist: Function, key: string, value: boolean) => {
    setChecklist({ ...checklist, [key]: value });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIconWrapper}>
          <Ionicons name="arrow-back-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Tips & Guides</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconWrapper} onPress={() => console.log("Search")}>
            <Ionicons name="search-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconWrapper} onPress={() => console.log("Bookmarks")}>
            <Ionicons name="bookmark" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* --- Stats Overview --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}33` }]}>
              <Ionicons name="library-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Total Guides</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.info}33` }]}>
              <Ionicons name="play-circle-outline" size={20} color={colors.info} />
            </View>
            <View>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Videos</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.warning}33` }]}>
              <Ionicons name="checkmark-done-outline" size={20} color={colors.warning} />
            </View>
            <View>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* --- Categories --- */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          <View style={styles.categories}>
            {(["All", "Planting", "Pest Control", "Post-harvest", "Soil Care", "Irrigation"] as Category[]).map(
              (category) => (
                <TouchableOpacity
                  key={category}
                  style={[ styles.categoryButton, activeCategory === category && styles.categoryButtonActive ]}
                  onPress={() => setActiveCategory(category)}
                >
                  <Text style={[ styles.categoryButtonText, activeCategory === category && styles.categoryButtonTextActive ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </ScrollView>

        {/* --- Featured Guides --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="star" size={18} color={colors.warning} /> Featured Guides
            </Text>
            <TouchableOpacity onPress={() => console.log("See All Featured")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <TouchableOpacity style={styles.featuredCard}>
              <ImageBackground style={styles.featuredImage} />
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Popular</Text>
                </View>
                <Text style={styles.featuredTitle}>Perfect Seed Spacing for Maize</Text>
                <Text style={styles.featuredDescription}>Learn optimal seed density techniques for a higher yield.</Text>
                <View style={styles.featuredFooter}>
                  <Text style={styles.readTime}><Ionicons name="time-outline" size={12} /> 5 min</Text>
                  <TouchableOpacity onPress={() => toggleSaved("featured1")}>
                    <Ionicons name={savedItems.has("featured1") ? "bookmark" : "bookmark-outline"} size={20} color={savedItems.has("featured1") ? colors.primary : colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featuredCard}>
              <ImageBackground style={styles.featuredImage} />
              <View style={styles.featuredContent}>
                <View style={[styles.featuredBadge, { backgroundColor: `${colors.info}33` }]}>
                  <Text style={[styles.featuredBadgeText, { color: colors.info }]}>New</Text>
                </View>
                <Text style={styles.featuredTitle}>Nutrient-rich Soil Guide</Text>
                <Text style={styles.featuredDescription}>Understand essential nutrients for healthy soil.</Text>
                <View style={styles.featuredFooter}>
                  <Text style={styles.readTime}><Ionicons name="time-outline" size={12} /> 7 min</Text>
                  <TouchableOpacity onPress={() => toggleSaved("featured2")}>
                    <Ionicons name={savedItems.has("featured2") ? "bookmark" : "bookmark-outline"} size={20} color={savedItems.has("featured2") ? colors.primary : colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            {/* ... other featured cards ... */}
          </ScrollView>
        </View>

        {/* --- Quick Guides --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="flash" size={18} color={colors.primary} /> Quick Tips
            </Text>
            <TouchableOpacity onPress={() => console.log("See All Tips")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.quickGuideItem}>
            <View style={[styles.quickGuideIconWrapper, { backgroundColor: `${colors.primary}33` }]}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.quickGuideTextContent}>
              <Text style={styles.quickGuideTitle}>Soil pH Testing Guide</Text>
              <Text style={styles.quickGuideMeta}><Ionicons name="time-outline" size={12} /> 3 min • 430 reads</Text>
            </View>
            <TouchableOpacity onPress={() => toggleSaved("quick1")}>
              <Ionicons name={savedItems.has("quick1") ? "bookmark" : "bookmark-outline"} size={20} color={savedItems.has("quick1") ? colors.primary : colors.textSecondary} />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickGuideItem}>
            <View style={[styles.quickGuideIconWrapper, { backgroundColor: `${colors.info}33` }]}>
              <Ionicons name="water-outline" size={24} color={colors.info} />
            </View>
            <View style={styles.quickGuideTextContent}>
              <Text style={styles.quickGuideTitle}>Water Management Tips</Text>
              <Text style={styles.quickGuideMeta}><Ionicons name="time-outline" size={12} /> 8 min • 290 reads</Text>
            </View>
            <TouchableOpacity onPress={() => toggleSaved("quick2")}>
              <Ionicons name={savedItems.has("quick2") ? "bookmark" : "bookmark-outline"} size={20} color={savedItems.has("quick2") ? colors.primary : colors.textSecondary} />
            </TouchableOpacity>
          </TouchableOpacity>
          {/* ... other quick guides ... */}
        </View>

        {/* --- Video Tutorials --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="play-circle" size={18} color={colors.primary} /> Video Tutorials
            </Text>
            <TouchableOpacity onPress={() => console.log("See All Videos")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.videoCard}>
              <ImageBackground style={[styles.videoThumbnail, { backgroundColor: colors.gray200 }]}>
                <View style={styles.playButton}><Ionicons name="play-circle" size={40} color={colors.white} /></View>
                <Text style={styles.videoDuration}>2:40</Text>
              </ImageBackground>
              <View style={styles.videoContent}>
                <Text style={styles.videoTitle}>Composting Basics</Text>
                <Text style={styles.videoDescription}>Build healthy soil with compost</Text>
                <View style={styles.videoFooter}>
                  <Text style={styles.videoViews}>1.2K views</Text>
                  <TouchableOpacity onPress={() => toggleSaved("video1")}>
                    <Ionicons name={savedItems.has("video1") ? "bookmark" : "bookmark-outline"} size={16} color={savedItems.has("video1") ? colors.primary : colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoCard}>
              <ImageBackground style={[styles.videoThumbnail, { backgroundColor: colors.gray300 }]}>
                <View style={styles.playButton}><Ionicons name="play-circle" size={40} color={colors.white} /></View>
                <Text style={styles.videoDuration}>1:28</Text>
              </ImageBackground>
              <View style={styles.videoContent}>
                <Text style={styles.videoTitle}>Transplanting Tips</Text>
                <Text style={styles.videoDescription}>Ensuring healthy growth</Text>
                <View style={styles.videoFooter}>
                  <Text style={styles.videoViews}>890 views</Text>
                  <TouchableOpacity onPress={() => toggleSaved("video2")}>
                    <Ionicons name={savedItems.has("video2") ? "bookmark" : "bookmark-outline"} size={16} color={savedItems.has("video2") ? colors.primary : colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            {/* ... other video cards ... */}
          </View>
        </View>

        {/* --- Checklist Templates --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="checkbox" size={18} color={colors.primary} /> Farming Checklists
            </Text>
            <TouchableOpacity onPress={() => console.log("See All Checklists")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Pre-planting Checklist */}
          <View style={styles.checklistCard}>
            <View style={styles.checklistHeader}>
              <View style={styles.checklistTitleSection}>
                <MaterialCommunityIcons name="sprout-outline" size={20} color={colors.primary} />
                <Text style={styles.checklistTitle}>Pre-planting Checklist</Text>
              </View>
              <View style={styles.checklistActions}>
                <TouchableOpacity style={styles.checklistAction}><Ionicons name="refresh-outline" size={18} color={colors.textSecondary} /></TouchableOpacity>
                <TouchableOpacity style={styles.checklistAction} onPress={() => toggleSaved("checklist1")}>
                  <Ionicons name={savedItems.has("checklist1") ? "bookmark" : "bookmark-outline"} size={18} color={savedItems.has("checklist1") ? colors.primary : colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.checklistProgress}>
              <View style={styles.progressBar}>
                <View style={[ styles.progressFill, { width: `${(getCompletedCount(prePlantingChecklist) / getTotalCount(prePlantingChecklist)) * 100}%` }]} />
              </View>
              <Text style={styles.checklistProgressText}>{getCompletedCount(prePlantingChecklist)}/{getTotalCount(prePlantingChecklist)} completed</Text>
            </View>
            <View style={styles.checklistRow}>
              <Switch trackColor={{ false: colors.border, true: `${colors.primary}80` }} thumbColor={prePlantingChecklist.phLevel ? colors.primary : colors.gray100} onValueChange={(v) => handleChecklistChange(prePlantingChecklist, setPrePlantingChecklist, 'phLevel', v)} value={prePlantingChecklist.phLevel} />
              <Text style={styles.checklistText}>Test soil pH level</Text>
            </View>
            <View style={styles.checklistRow}>
              <Switch trackColor={{ false: colors.border, true: `${colors.primary}80` }} thumbColor={prePlantingChecklist.soilTest ? colors.primary : colors.gray100} onValueChange={(v) => handleChecklistChange(prePlantingChecklist, setPrePlantingChecklist, 'soilTest', v)} value={prePlantingChecklist.soilTest} />
              <Text style={styles.checklistText}>Prepare seedbed</Text>
            </View>
            {/* ... other checklist items ... */}
          </View>

          {/* Pest Monitoring Checklist */}
          <View style={styles.checklistCard}>
            <View style={styles.checklistHeader}>
              <View style={styles.checklistTitleSection}>
                <MaterialCommunityIcons name="bug-outline" size={20} color={colors.error} />
                <Text style={styles.checklistTitle}>Pest Monitoring Steps</Text>
              </View>
              <View style={styles.checklistActions}>
                <TouchableOpacity style={styles.checklistAction}><Ionicons name="refresh-outline" size={18} color={colors.textSecondary} /></TouchableOpacity>
                <TouchableOpacity style={styles.checklistAction} onPress={() => toggleSaved("checklist2")}>
                  <Ionicons name={savedItems.has("checklist2") ? "bookmark" : "bookmark-outline"} size={18} color={savedItems.has("checklist2") ? colors.primary : colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.checklistProgress}>
              <View style={styles.progressBar}>
                <View style={[ styles.progressFill, { width: `${(getCompletedCount(pestMonitoringChecklist) / getTotalCount(pestMonitoringChecklist)) * 100}%`, backgroundColor: colors.error }]} />
              </View>
              <Text style={styles.checklistProgressText}>{getCompletedCount(pestMonitoringChecklist)}/{getTotalCount(pestMonitoringChecklist)} completed</Text>
            </View>
            <View style={styles.checklistRow}>
              <Switch trackColor={{ false: colors.border, true: `${colors.error}80` }} thumbColor={pestMonitoringChecklist.dailyCheck ? colors.error : colors.gray100} onValueChange={(v) => handleChecklistChange(pestMonitoringChecklist, setPestMonitoringChecklist, 'dailyCheck', v)} value={pestMonitoringChecklist.dailyCheck} />
              <Text style={styles.checklistText}>Daily visual inspection</Text>
            </View>
            {/* ... other checklist items ... */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// COMPLETE THEME-AWARE STYLES
const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  screenTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  headerIconWrapper: {
    padding: 4,
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  // Stats
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  // Categories
  categoriesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categories: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  categoryButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: colors.background,
    fontWeight: "700",
  },
  // Sections
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  // Featured Guides
  featuredCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: 280,
    marginRight: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  featuredImage: {
    width: "100%",
    height: 140,
    backgroundColor: colors.gray100, // Themed placeholder
  },
  featuredContent: {
    padding: 16,
  },
  featuredBadge: {
    backgroundColor: `${colors.warning}33`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  featuredBadgeText: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: "600",
  },
  featuredTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  featuredDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  readTime: {
    color: colors.textSecondary,
    fontSize: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  // Quick Guides
  quickGuideItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickGuideIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${colors.primary}33`,
  },
  quickGuideTextContent: {
    flex: 1,
    marginLeft: 16,
  },
  quickGuideTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  quickGuideMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  // Video Tutorials
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  videoCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  videoThumbnail: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray200, // Themed placeholder
  },
  playButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  videoDuration: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: `${colors.black}CC`,
    color: colors.white,
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoContent: {
    padding: 12,
  },
  videoTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  videoDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 8,
  },
  videoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  videoViews: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  // Checklist Templates
  checklistCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  checklistTitleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  checklistTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  checklistActions: {
    flexDirection: "row",
    gap: 8,
  },
  checklistAction: {
    padding: 4,
  },
  checklistProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  checklistProgressText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  checklistText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
  },
});
