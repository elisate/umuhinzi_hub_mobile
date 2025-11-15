import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext'; // Adjust path
import { getThemeColors, ThemeColors } from '../constants/theme'; // Adjust path

// Theme-aware data creator
const createNotificationsData = (colors: ThemeColors) => [
  { id: '1', type: 'alert', title: 'Disease Alert - Urgent', message: 'Leaf rust detected in maize crops within 5km...', time: '2 hours ago', read: false, icon: 'warning', color: colors.error, priority: 'high', category: 'crop_health', action: 'view_details' },
  { id: '2', type: 'reminder', title: 'Watering Schedule', message: 'Time to water your maize field. Optimal window: 6-8 AM', time: '5 hours ago', read: false, icon: 'water', color: colors.info, priority: 'medium', category: 'reminder', action: 'snooze' },
  { id: '3', type: 'weather', title: 'Heavy Rain Warning', message: 'Heavy rainfall expected tomorrow. Plan harvesting.', time: '1 day ago', read: true, icon: 'rainy', color: colors.info, priority: 'high', category: 'weather', action: 'view_forecast' },
  { id: '4', type: 'system', title: 'New Farming Tips Available', message: 'Check out new planting techniques for maize.', time: '2 days ago', read: true, icon: 'leaf', color: colors.primary, priority: 'low', category: 'tips', action: 'view_tips' },
  { id: '5', type: 'pest', title: 'Fall Armyworm Alert', message: 'Increased Fall Armyworm activity reported.', time: '3 days ago', read: true, icon: 'bug', color: colors.warning, priority: 'high', category: 'pest', action: 'view_pest_info' },
  { id: '6', type: 'maintenance', title: 'Equipment Service Due', message: 'Your irrigation system is due for maintenance.', time: '4 days ago', read: true, icon: 'construct', color: colors.warning, priority: 'medium', category: 'maintenance', action: 'schedule_service' },
];

const createNotificationCategories = (notifications: any[]) => [
  { id: 'all', name: 'All', icon: 'notifications', count: notifications.length },
  { id: 'unread', name: 'Unread', icon: 'ellipse', count: notifications.filter(n => !n.read).length },
  { id: 'crop_health', name: 'Crop Health', icon: 'leaf', count: notifications.filter(n => n.category === 'crop_health').length },
  { id: 'weather', name: 'Weather', icon: 'cloud', count: notifications.filter(n => n.category === 'weather').length },
  { id: 'pest', name: 'Pests', icon: 'bug', count: notifications.filter(n => n.category === 'pest').length },
];

export default function NotificationsScreen() {
  const router = useRouter();
  
  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  // --- STATE ---
  const [notificationsList, setNotificationsList] = useState(() => createNotificationsData(colors));
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [settings, setSettings] = useState({
    cropAlerts: true, weatherAlerts: true, reminders: true,
    systemUpdates: false, pestAlerts: true, maintenanceReminders: true,
    pushNotifications: true, emailDigest: false,
  });

  // Re-create data if theme changes
  useEffect(() => {
    setNotificationsList(createNotificationsData(colors));
  }, [colors]);

  // --- DERIVED STATE ---
  const notificationCategories = createNotificationCategories(notificationsList);
  const filteredNotifications = notificationsList.filter(notification => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'unread') return !notification.read;
    return notification.category === selectedCategory;
  });

  const unreadCount = notificationCategories.find(c => c.id === 'unread')?.count || 0;
  const highPriorityCount = notificationsList.filter(n => n.priority === 'high' && !n.read).length;

  // --- THEME-AWARE HELPER ---
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return { icon: 'warning-outline', color: colors.error };
      case 'medium': return { icon: 'information-circle-outline', color: colors.warning };
      case 'low': return { icon: 'notifications-outline', color: colors.info };
      default: return { icon: 'notifications-outline', color: colors.textSecondary };
    }
  };
  // ---

  // --- HANDLERS ---
  const markAsRead = (id: string) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    Alert.alert('Mark all as read?', 'This will mark all notifications as read.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark All', onPress: () => setNotificationsList(prev => prev.map(n => ({ ...n, read: true }))) },
      ]
    );
  };

  const deleteNotification = (id: string) => {
    setNotificationsList(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    Alert.alert('Clear all notifications?', 'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => setNotificationsList([]) },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setNotificationsList(createNotificationsData(colors));
      setRefreshing(false);
    }, 1500);
  };

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value as boolean }));
  };

  const handleNotificationAction = (notification: any) => {
    markAsRead(notification.id);
    switch (notification.action) {
      case 'view_details': router.push('/pests'); break;
      case 'view_tips': router.push('/tips'); break;
      case 'view_pest_info': router.push('/pests'); break;
      default: console.log("Handling action:", notification.action);
    }
  };
  // ---

  const NotificationItem = ({ notification }: { notification: any }) => {
    const priorityInfo = getPriorityIcon(notification.priority);
    return (
      <TouchableOpacity
        style={[ styles.notificationItem, !notification.read && styles.unreadNotification, notification.priority === 'high' && !notification.read && styles.highPriorityNotification ]}
        onPress={() => handleNotificationAction(notification)}
        onLongPress={() => deleteNotification(notification.id)}
      >
        <View style={styles.notificationLeft}>
          <View style={[styles.notificationIcon, { backgroundColor: `${notification.color}33` }]}>
            <Ionicons name={notification.icon as any} size={20} color={notification.color} />
          </View>
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              {!notification.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <View style={styles.notificationFooter}>
              <Text style={styles.notificationTime}>{notification.time}</Text>
              <View style={styles.priorityBadge}>
                <Ionicons name={priorityInfo.icon as any} size={12} color={priorityInfo.color} />
                <Text style={[styles.priorityText, { color: priorityInfo.color }]}>{notification.priority}</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={() => deleteNotification(notification.id)}>
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead} disabled={unreadCount === 0}>
          <Text style={[styles.headerActionText, unreadCount === 0 && styles.headerActionDisabled]}>Mark All</Text>
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
              <Text style={styles.statNumber}>{highPriorityCount}</Text>
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
              <Ionicons name="time-outline" size={20} color={colors.info} />
            </View>
            <View>
              <Text style={styles.statNumber}>{notificationsList.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>
      
        {/* Notification Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Notification Settings</Text>
            <TouchableOpacity>
              <Ionicons name="settings-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="leaf-outline" size={20} color={colors.primary} />
                <Text style={styles.settingTitle}>Crop Alerts</Text>
              </View>
              <Switch
                value={settings.cropAlerts}
                onValueChange={(value) => updateSetting('cropAlerts', value)}
                trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                thumbColor={settings.cropAlerts ? colors.primary : colors.gray100}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="cloud-outline" size={20} color={colors.info} />
                <Text style={styles.settingTitle}>Weather Alerts</Text>
              </View>
              <Switch
                value={settings.weatherAlerts}
                onValueChange={(value) => updateSetting('weatherAlerts', value)}
                trackColor={{ false: colors.border, true: `${colors.info}80` }}
                thumbColor={settings.weatherAlerts ? colors.info : colors.gray100}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="bug-outline" size={20} color={colors.warning} />
                <Text style={styles.settingTitle}>Pest Alerts</Text>
              </View>
              <Switch
                value={settings.pestAlerts}
                onValueChange={(value) => updateSetting('pestAlerts', value)}
                trackColor={{ false: colors.border, true: `${colors.warning}80` }}
                thumbColor={settings.pestAlerts ? colors.warning : colors.gray100}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="construct-outline" size={20} color={colors.warning} />
                <Text style={styles.settingTitle}>Maintenance</Text>
              </View>
              <Switch
                value={settings.maintenanceReminders}
                onValueChange={(value) => updateSetting('maintenanceReminders', value)}
                trackColor={{ false: colors.border, true: `${colors.warning}80` }}
                thumbColor={settings.maintenanceReminders ? colors.warning : colors.gray100}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.settingTitle}>Push Notifications</Text>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={(value) => updateSetting('pushNotifications', value)}
                trackColor={{ false: colors.border, true: `${colors.textSecondary}80` }}
                thumbColor={settings.pushNotifications ? colors.textSecondary : colors.gray100}
              />
            </View>
          </View>
        </View>

        {/* Categories Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          <View style={styles.categories}>
            {notificationCategories.map((category) => (
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
  
        {/* Notifications List */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {notificationCategories.find(c => c.id === selectedCategory)?.name || 'Notifications'}
              </Text>
              <Text style={styles.sectionSubtitle}>{filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'}</Text>
            </View>
            {filteredNotifications.length > 0 && (
              <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={64} color={colors.border} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyDescription}>
                {selectedCategory === 'unread' ? "You're all caught up!" : "No notifications in this category."}
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {filteredNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
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
            <Text style={styles.quickActionText}>Emergency Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/tips')}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}33` }]}>
              <Ionicons name="book-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Farming Tips</Text>
          </TouchableOpacity>
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
    padding: 16,
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    justifyContent: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
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
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.background,
  },
  categoryCount: {
    backgroundColor: `${colors.primary}33`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
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
  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  // Settings
  settingsGrid: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  // Notifications
  notificationsList: {
    gap: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.background, // Use background for items inside a card
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  unreadNotification: {
    backgroundColor: `${colors.primary}1A`,
    borderLeftColor: colors.primary,
  },
  highPriorityNotification: {
    borderLeftColor: colors.error,
    backgroundColor: `${colors.error}1A`,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  notificationTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notificationMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.gray100}80`, // themed background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  moreButton: {
    padding: 4,
    marginLeft: 8,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
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
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
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
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
