import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext'; // Adjust path
import { getThemeColors, ThemeColors } from '../constants/theme'; // Adjust path

const { width: screenWidth } = Dimensions.get('window');

// Data creator function to make it theme-aware
const createAlertsData = (colors: ThemeColors) => [
  {
    id: '1', type: 'disease', title: 'Leaf Rust Alert', severity: 'high', location: 'Your Region', crop: 'Maize',
    description: 'High risk of leaf rust infection due to recent weather conditions. Check your maize crops for yellow spots on leaves.',
    action: 'Apply fungicide and monitor closely', date: '2 hours ago', read: false,
    icon: 'warning', color: colors.error, urgent: true,
  },
  {
    id: '2', type: 'weather', title: 'Heavy Rain Warning', severity: 'medium', location: 'Your Area', crop: 'All Crops',
    description: 'Heavy rainfall expected in the next 24 hours. Prepare drainage and protect sensitive crops.',
    action: 'Check drainage systems and postpone spraying', date: '5 hours ago', read: false,
    icon: 'rainy', color: colors.info, urgent: false,
  },
  {
    id: '3', type: 'pest', title: 'Fall Armyworm Detection', severity: 'high', location: 'Neighboring Farms', crop: 'Maize',
    description: 'Fall armyworm reported in nearby farms. Increased monitoring recommended.',
    action: 'Inspect crops and set up pheromone traps', date: '1 day ago', read: true,
    icon: 'bug', color: colors.error, urgent: true,
  },
  {
    id: '4', type: 'market', title: 'Price Drop Alert', severity: 'low', location: 'Local Market', crop: 'Beans',
    description: 'Bean prices have dropped by 15% this week. Consider alternative marketing strategies.',
    action: 'Explore storage options or alternative markets', date: '2 days ago', read: true,
    icon: 'trending-down', color: colors.warning, urgent: false,
  },
  {
    id: '5', type: 'system', title: 'AURA Update Available', severity: 'low', location: 'App', crop: 'System',
    description: 'New features available including improved pest detection and weather forecasting.',
    action: 'Update app for enhanced features', date: '3 days ago', read: true,
    icon: 'notifications', color: colors.primary, urgent: false,
  },
  {
    id: '6', type: 'irrigation', title: 'Water Shortage Warning', severity: 'medium', location: 'Your Region', crop: 'All Crops',
    description: 'Reduced water availability expected next week. Plan irrigation schedules accordingly.',
    action: 'Optimize water usage and prioritize key crops', date: '4 days ago', read: true,
    icon: 'water', color: colors.info, urgent: false,
  },
];

// This function now depends on the alerts list
const createAlertCategories = (alerts: any[]) => [
  { id: 'all', name: 'All', icon: 'notifications', count: alerts.length },
  { id: 'unread', name: 'Unread', icon: 'mail-unread', count: alerts.filter(a => !a.read).length },
  { id: 'urgent', name: 'Urgent', icon: 'warning', count: alerts.filter(a => a.urgent).length },
  { id: 'disease', name: 'Disease', icon: 'medical', count: alerts.filter(a => a.type === 'disease').length },
  { id: 'pest', name: 'Pests', icon: 'bug', count: alerts.filter(a => a.type === 'pest').length },
  { id: 'weather', name: 'Weather', icon: 'cloud', count: alerts.filter(a => a.type === 'weather').length },
];

export default function AlertsScreen() {
  const router = useRouter();

  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  // --- STATE ---
  const [alertsList, setAlertsList] = useState(() => createAlertsData(colors));
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Re-create data if theme changes
  useEffect(() => {
    setAlertsList(createAlertsData(colors));
  }, [colors]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // --- DERIVED STATE ---
  const alertCategories = createAlertCategories(alertsList);
  const filteredAlerts = alertsList.filter(alert => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'unread') return !alert.read;
    if (selectedCategory === 'urgent') return alert.urgent;
    return alert.type === selectedCategory;
  });

  const unreadCount = alertCategories.find(c => c.id === 'unread')?.count || 0;
  const urgentCount = alertsList.filter(a => a.urgent && !a.read).length; // Original logic was better

  // --- THEME-AWARE HELPERS ---
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return { icon: 'warning', color: colors.error, label: 'Critical' };
      case 'medium': return { icon: 'information-circle-outline', color: colors.warning, label: 'Important' }; // Changed icon
      case 'low': return { icon: 'notifications-outline', color: colors.info, label: 'Info' }; // Changed icon
      default: return { icon: 'notifications-outline', color: colors.textSecondary, label: 'Info' };
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      disease: { icon: 'medical-outline', color: colors.error }, // Changed icon
      weather: { icon: 'cloud-outline', color: colors.info }, // Changed icon
      pest: { icon: 'bug-outline', color: colors.error }, // Changed icon
      market: { icon: 'trending-down-outline', color: colors.warning }, // Changed icon
      system: { icon: 'notifications-outline', color: colors.primary }, // Changed icon
      irrigation: { icon: 'water-outline', color: colors.info }, // Changed icon
    };
    return icons[type as keyof typeof icons] || { icon: 'notifications-outline', color: colors.textSecondary };
  };
  // ---

  // --- HANDLERS ---
  const markAsRead = (id: string) => {
    setAlertsList(prev => prev.map(alert => alert.id === id ? { ...alert, read: true } : alert));
  };

  const markAllAsRead = () => {
    Alert.alert('Mark all as read?', 'This will mark all alerts as read.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark All', onPress: () => setAlertsList(prev => prev.map(alert => ({ ...alert, read: true }))) },
      ]
    );
  };

  const deleteAlert = (id: string) => {
    Alert.alert('Delete Alert?', 'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setAlertsList(prev => prev.filter(alert => alert.id !== id)) },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setAlertsList(createAlertsData(colors));
      setRefreshing(false);
    }, 1500);
  };
  
  const clearSelectedCategory = () => {
    Alert.alert(
      `Clear all ${selectedCategory} alerts?`,
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            if (selectedCategory === 'all') {
              setAlertsList([]);
            } else {
              setAlertsList(prev => 
                prev.filter(alert => 
                  selectedCategory === 'unread' ? alert.read :
                  selectedCategory === 'urgent' ? !alert.urgent :
                  alert.type !== selectedCategory
                )
              );
            }
          },
        },
      ]
    );
  };
  // ---

  const AlertItem = ({ alert }: { alert: any }) => {
    const severityInfo = getSeverityIcon(alert.severity);
    const typeInfo = getTypeIcon(alert.type);
    const isExpanded = expandedAlert === alert.id;

    return (
      <Animated.View style={[styles.alertCard, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={[
            styles.alertHeader,
            !alert.read && styles.alertHeaderUnread,
            alert.urgent && !alert.read && styles.alertHeaderUrgent,
          ]}
          onPress={() => {
            setExpandedAlert(isExpanded ? null : alert.id);
            if (!alert.read) markAsRead(alert.id);
          }}
        >
          <View style={styles.alertMain}>
            <View style={[styles.alertIcon, { backgroundColor: `${typeInfo.color}33` }]}>
              <Ionicons name={typeInfo.icon as any} size={20} color={typeInfo.color} />
            </View>
            <View style={styles.alertContent}>
              <View style={styles.alertTitleRow}>
                <Text style={styles.alertTitle} numberOfLines={1}>{alert.title}</Text>
                {!alert.read && <View style={styles.unreadDot} />}
              </View>
              <View style={styles.alertMeta}>
                <Text style={styles.alertCrop}>{alert.crop}</Text>
                <Text style={styles.alertDate}>{alert.date}</Text>
              </View>
            </View>
          </View>
          <View style={styles.alertSeverity}>
            <Ionicons name={severityInfo.icon as any} size={16} color={severityInfo.color} />
            <Text style={[styles.severityText, { color: severityInfo.color }]}>
              {severityInfo.label}
            </Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.alertDetails}>
            <Text style={styles.alertDescription}>{alert.description}</Text>
            <View style={styles.actionSection}>
              <View style={styles.actionHeader}>
                <Ionicons name="flash" size={16} color={colors.warning} />
                <Text style={styles.actionLabel}>Recommended Action</Text>
              </View>
              <Text style={styles.actionText}>{alert.action}</Text>
            </View>
            <View style={styles.alertActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/chat')}>
                <Ionicons name="chatbubble-outline" size={16} color={colors.info} />
                <Text style={[styles.actionButtonText, {color: colors.info}]}>Ask AURA</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => deleteAlert(alert.id)}>
                <Ionicons name="trash-outline" size={16} color={colors.error} />
                <Text style={[styles.actionButtonText, {color: colors.error}]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alerts</Text>
        <TouchableOpacity onPress={markAllAsRead} disabled={unreadCount === 0}>
          <Text style={[styles.headerActionText, unreadCount === 0 && styles.headerActionDisabled]}>
            Mark All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.card}
          />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.error}33` }]}>
              <Ionicons name="warning-outline" size={20} color={colors.error} />
            </View>
            <View>
              <Text style={styles.statNumber}>{urgentCount}</Text>
              <Text style={styles.statLabel}>Urgent</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}33` }]}>
              <Ionicons name="mail-unread-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.statNumber}>{unreadCount}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.info}33` }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.info} />
            </View>
            <View>
              <Text style={styles.statNumber}>{alertsList.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Categories Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          <View style={styles.categories}>
            {alertCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[ styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons name={category.icon as any} size={16} color={selectedCategory === category.id ? colors.background : colors.textSecondary} />
                <Text style={[ styles.categoryText, selectedCategory === category.id && styles.categoryTextActive ]}>
                  {category.name}
                </Text>
                {category.count > 0 && (
                  <View style={[ styles.categoryCount, selectedCategory === category.id && styles.categoryCountActive ]}>
                    <Text style={[ styles.categoryCountText, selectedCategory === category.id && styles.categoryCountTextActive ]}>
                      {category.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Alerts List */}
        <View style={styles.alertsSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {alertCategories.find(c => c.id === selectedCategory)?.name} Alerts
              </Text>
              <Text style={styles.sectionSubtitle}>
                {filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'}
              </Text>
            </View>
            {filteredAlerts.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  if (selectedCategory === 'unread') {
                    markAllAsRead();
                  } else {
                    clearSelectedCategory();
                  }
                }}
              >
                <Text style={styles.clearText}>
                  {selectedCategory === 'unread' ? 'Mark All Read' : 'Clear All'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredAlerts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name={selectedCategory === 'unread' ? "checkmark-done" : "notifications-off"} size={64} color={colors.border} />
              <Text style={styles.emptyTitle}>
                {selectedCategory === 'unread' ? 'No Unread Alerts' : 'No Alerts'}
              </Text>
              <Text style={styles.emptyDescription}>
                {selectedCategory === 'unread' ? "You're all caught up!" : "No alerts found in this category."}
              </Text>
            </View>
          ) : (
            <View style={styles.alertsList}>
              {filteredAlerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions - This was missing */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/emergency')}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.error}33` }]}>
              <Ionicons name="warning-outline" size={24} color={colors.error} />
            </View>
            <Text style={styles.quickActionText}>Emergency</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/pests')}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.warning}33` }]}>
              <MaterialCommunityIcons name="bug-outline" size={24} color={colors.warning} />
            </View>
            <Text style={styles.quickActionText}>Pest Control</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/tips')}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}33` }]}>
              <Ionicons name="book-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Farming Tips</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/chat')}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.info}33` }]}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.info} />
            </View>
            <Text style={styles.quickActionText}>Ask AURA</Text>
          </TouchableOpacity>
        </View>

        {/* Alert Tips - This was missing */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={20} color={colors.primary} />
            <Text style={styles.tipsTitle}>Alert Management Tips</Text>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={colors.primary} />
              <Text style={styles.tipText}>Review alerts daily for timely actions</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={colors.primary} />
              <Text style={styles.tipText}>High severity alerts require immediate attention</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={14} color={colors.primary} />
              <Text style={styles.tipText}>Use AURA chat for personalized advice</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  headerActionDisabled: {
    color: colors.textSecondary,
    opacity: 0.7,
  },
  container: {
    flex: 1,
    padding: 12,
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  // Categories
  categoriesScroll: {
    marginHorizontal: -12,
    paddingHorizontal: 12,
  },
  categories: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.background,
  },
  categoryCount: {
    backgroundColor: `${colors.primary}33`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryCountActive: {
    backgroundColor: `${colors.background}33`,
  },
  categoryCountText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryCountTextActive: {
    color: colors.background,
  },
  // Alerts Section
  alertsSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  clearButton: {
    padding: 6,
  },
  clearText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '600',
  },
  // Alerts List
  alertsList: {
    gap: 10,
  },
  alertCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  alertHeaderUnread: {
    backgroundColor: `${colors.primary}1A`,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  alertHeaderUrgent: {
    backgroundColor: `${colors.error}1A`,
    borderLeftColor: colors.error,
  },
  alertMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertCrop: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  alertDate: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  alertSeverity: {
    alignItems: 'center',
    gap: 2,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  alertDetails: {
    padding: 14,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  alertDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  actionSection: {
    backgroundColor: `${colors.warning}26`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  actionLabel: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 16,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  // Empty State
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
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  // Quick Actions (from original file)
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'space-between', // Ensures 2x2 grid
  },
  quickAction: {
    width: (screenWidth - 40) / 2, // 2-column grid with padding
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Tips Card (from original file)
  tipsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
    lineHeight: 16,
  },
});
