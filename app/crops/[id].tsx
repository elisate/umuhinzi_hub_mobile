import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors, ThemeColors } from '../../constants/theme';

// Mock crop data - in real app, this would come from API
const cropData = {
  '1': {
    id: '1',
    name: 'Maize Field 1',
    type: 'Maize',
    variety: 'Hybrid 621',
    plantingDate: '15/03/2024',
    area: '2.5',
    unit: 'acres',
    location: 'North Field',
    soilType: 'Loam',
    stage: 'Flowering',
    health: 'Good',
    notes: 'Planted during rainy season. Good germination rate.',
    activities: [
      { id: '1', type: 'Planting', date: '15/03/2024', notes: 'Seeds planted with fertilizer' },
      { id: '2', type: 'Weeding', date: '30/03/2024', notes: 'First weeding completed' },
      { id: '3', type: 'Fertilizing', date: '15/04/2024', notes: 'NPK fertilizer applied' },
    ],
    nextTasks: [
      { id: '1', task: 'Watering', dueIn: 2, priority: 'high' },
      { id: '2', task: 'Pest Control', dueIn: 5, priority: 'medium' },
    ]
  },
  '2': {
    id: '2',
    name: 'Beans Garden',
    type: 'Beans',
    variety: 'Red Kidney',
    plantingDate: '01/04/2024',
    area: '0.5',
    unit: 'acres',
    location: 'Backyard',
    soilType: 'Sandy Loam',
    stage: 'Vegetative',
    health: 'Excellent',
    notes: 'Organic farming. No chemicals used.',
    activities: [
      { id: '1', type: 'Planting', date: '01/04/2024', notes: 'Direct seeding' },
    ],
    nextTasks: [
      { id: '1', task: 'Fertilizing', dueIn: 1, priority: 'high' },
    ]
  }
};

export default function CropDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const crop = cropData[id as string];

  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- THEME-AWARE HELPERS ---
  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case 'excellent': return colors.success;
      case 'good': return colors.info;
      case 'fair': return colors.warning;
      case 'poor': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.info;
      default: return colors.textSecondary;
    }
  };
  // ---

  if (!crop) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crop Not Found</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.container}>
          <View style={styles.errorCard}>
            <Ionicons name="sad-outline" size={48} color={colors.error} />
            <Text style={styles.errorTitle}>Crop Not Found</Text>
            <Text style={styles.errorDescription}>
              The crop you&apos;re looking for doesn&apos;t exist or has been removed.
            </Text>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleDeleteCrop = () => {
    // Hide modal first
    setShowDeleteConfirm(false);

    Alert.alert(
      'Delete Crop',
      `Are you sure you want to delete ${crop.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In real app, call API to delete
            Alert.alert('Success', 'Crop deleted successfully');
            router.back();
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{crop.name}</Text>
        <TouchableOpacity onPress={() => setShowDeleteConfirm(true)}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Crop Overview */}
        <View style={styles.card}>
          <View style={styles.cropHeader}>
            <View style={styles.cropIcon}>
              <MaterialCommunityIcons name="sprout" size={24} color={colors.primary} />
            </View>
            <View style={styles.cropBasicInfo}>
              <Text style={styles.cropName}>{crop.name}</Text>
              <Text style={styles.cropType}>{crop.type} • {crop.variety}</Text>
            </View>
            <View style={[styles.healthBadge, { backgroundColor: `${getHealthColor(crop.health)}20` }]}>
              <Text style={[styles.healthText, { color: getHealthColor(crop.health) }]}>
                {crop.health}
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{crop.area} {crop.unit}</Text>
              <Text style={styles.statLabel}>Area</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{crop.stage}</Text>
              <Text style={styles.statLabel}>Growth Stage</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{crop.activities.length}</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Information</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Planted:</Text>
              <Text style={styles.infoValue}>{crop.plantingDate}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{crop.location}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="earth-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Soil Type:</Text>
              <Text style={styles.infoValue}>{crop.soilType}</Text>
            </View>
          </View>

          {crop.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{crop.notes}</Text>
            </View>
          )}
        </View>

        {/* Next Tasks */}
        {crop.nextTasks.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Next Tasks</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllLink}>View All</Text>
              </TouchableOpacity>
            </View>

            {crop.nextTasks.map((task: any) => (
              <TouchableOpacity key={task.id} style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskName}>{task.task}</Text>
                  <Text style={styles.taskDue}>
                    Due in {task.dueIn} day{task.dueIn !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(task.priority)}20` }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                    {task.priority}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Activities */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Activities</Text>
            <TouchableOpacity onPress={() => router.push('/activities/new')}>
              <Text style={styles.viewAllLink}>Add New</Text>
            </TouchableOpacity>
          </View>

          {crop.activities.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="list-outline" size={32} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No activities recorded</Text>
              <Text style={styles.emptySubtext}>Start by adding your first activity</Text>
            </View>
          ) : (
            crop.activities.map((activity: any, index: any) => (
              <View 
                key={activity.id} 
                style={[
                  styles.activityItem,
                  index === crop.activities.length - 1 && styles.activityItemLast // Remove border for last item
                ]}
              >
                <View style={styles.activityIcon}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityType}>{activity.type}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                  {activity.notes && (
                    <Text style={styles.activityNotes}>{activity.notes}</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* --- UPDATED: Quick Actions --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/activities/new')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}33` }]}>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Record Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/scan')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.info}33` }]}>
                <Ionicons name="camera" size={24} color={colors.info} />
              </View>
              <Text style={styles.quickActionText}>Scan Health</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => Alert.alert('Edit Crop', 'Edit functionality would go here')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.warning}33` }]}>
                <Ionicons name="create-outline" size={24} color={colors.warning} />
              </View>
              <Text style={styles.quickActionText}>Edit Crop</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/chat')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.info}33` }]}>
                <Ionicons name="chatbubble-ellipses" size={24} color={colors.info} />
              </View>
              <Text style={styles.quickActionText}>Ask AURA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning-outline" size={48} color={colors.error} />
            <Text style={styles.modalTitle}>Delete Crop</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete {crop.name}? This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancel}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalDelete}
                onPress={handleDeleteCrop}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    width: 24, // Matched trash icon size
  },
  container: {
    flex: 1,
    padding: 15,
  },
  errorCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginTop: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  cropHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cropIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${colors.primary}33`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cropBasicInfo: {
    flex: 1,
  },
  cropName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cropType: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  healthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  healthText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  infoGrid: {
    gap: 12,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    width: 80,
  },
  infoValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  notesSection: {
    marginTop: 10,
  },
  notesLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDue: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}33`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDate: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  activityNotes: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  // --- STYLES FOR QUICK ACTIONS ---
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // This will space the '48%' items
  },
  quickAction: {
    width: '48%', // This makes it a 2-column grid
    alignItems: 'center', // This centers the content vertically
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12, // This adds space between rows
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Space between icon and text
  },
  quickActionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  // --- END STYLES FOR QUICK ACTIONS ---
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${colors.black}CC`, // 0.8 opacity
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  modalMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancel: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modalDelete: {
    flex: 1,
    backgroundColor: `${colors.error}20`,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  modalDeleteText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
});