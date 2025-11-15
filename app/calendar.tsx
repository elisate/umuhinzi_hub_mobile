import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
  RefreshControl, // Added RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext'; // Adjust path
import { getThemeColors, ThemeColors } from '../constants/theme'; // Adjust path

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

// Sample data (no colors)
const tasks = [
  { id: '1', title: 'Water Maize', crop: 'Maize Field 1', type: 'watering', date: new Date().toISOString().split('T')[0], time: '06:00 AM', duration: '2h', priority: 'high', completed: false },
  { id: '2', title: 'Fertilize Beans', crop: 'Beans Garden', type: 'fertilizing', date: new Date().toISOString().split('T')[0], time: '08:00 AM', duration: '1h', priority: 'medium', completed: false },
  { id: '3', title: 'Weed Patch', crop: 'Vegetable Patch', type: 'weeding', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '07:00 AM', duration: '2h', priority: 'low', completed: true },
];
const events = [
  { id: '1', title: 'Market Day', type: 'market', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '08:00 AM', location: 'Town Market', description: 'Weekly produce market' },
];
const cropSchedules = [
  { crop: 'Maize', stage: 'Vegetative', tasks: ['Weeding', 'Fertilizer', 'Pest check'], nextStage: 'Tasseling soon' },
  { crop: 'Beans', stage: 'Flowering', tasks: ['Watering', 'Support', 'Disease check'], nextStage: 'Pod formation' }
];

export default function CalendarScreen() {
  const router = useRouter();

  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState<'tasks' | 'events' | 'schedule'>('tasks');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false); // Added refreshing state

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [view]); // Animate when view changes

  const dailyTasks = tasks.filter(task => task.date === selectedDate);
  const dailyEvents = events.filter(event => event.date === selectedDate);

  // --- THEME-AWARE HELPERS ---
  const getTaskIcon = (type: string) => {
    const icons = { watering: '💧', fertilizing: '🌱', spraying: '🧪', weeding: '🌿', testing: '🔬', harvesting: '📦', planting: '🪴' };
    return icons[type as keyof typeof icons] || '📅';
  };

  const getTaskColor = (type: string) => {
    const taskColors = {
      watering: colors.info,
      fertilizing: colors.primary,
      spraying: colors.warning,
      weeding: colors.success, // Using success as a green
      testing: colors.textSecondary,
      harvesting: colors.warning,
      planting: colors.primary,
    };
    return taskColors[type as keyof typeof taskColors] || colors.textSecondary;
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'high' ? colors.error : 
           priority === 'medium' ? colors.warning : colors.info;
  };
  // ---

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getWeekDates = () => {
    const dates = [];
    const today = new Date(selectedDate);
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2),
        number: date.getDate().toString(),
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const toggleTaskCompletion = (taskId: string) => {
    Alert.alert('Mark as completed?', 'This will mark the task as done.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark Complete', onPress: () => {
          // In real app, update state:
          // setTasks(tasks.map(t => t.id === taskId ? {...t, completed: !t.completed} : t));
        }},
      ]
    );
  };

  const TaskItem = ({ task }: { task: any }) => (
    <TouchableOpacity style={styles.taskItem} onPress={() => toggleTaskCompletion(task.id)}>
      <View style={[styles.taskIcon, { backgroundColor: `${getTaskColor(task.type)}33` }]}>
        <Text style={styles.taskIconText}>{getTaskIcon(task.type)}</Text>
      </View>
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
        </View>
        <Text style={styles.taskCrop} numberOfLines={1}>{task.crop}</Text>
        <View style={styles.taskMeta}>
          <Text style={styles.taskTime}>{task.time}</Text>
          <Text style={styles.taskDuration}>• {task.duration}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        onPress={() => toggleTaskCompletion(task.id)}
      >
        {task.completed && <Ionicons name="checkmark" size={14} color={colors.background} />}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const EventItem = ({ event }: { event: any }) => (
    <View style={styles.eventItem}>
      <View style={[styles.eventIcon, { backgroundColor: `${colors.primary}33` }]}>
        <Text style={styles.eventIconText}>🛒</Text>
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={1}>{event.description}</Text>
        <View style={styles.eventMeta}>
          <Ionicons name="time-outline" size={10} color={colors.textSecondary} />
          <Text style={styles.eventTime}>{event.time}</Text>
        </View>
      </View>
    </View>
  );

  const CropScheduleItem = ({ schedule }: { schedule: any }) => (
    <View style={styles.cropScheduleItem}>
      <View style={styles.cropHeader}>
        <Text style={styles.cropName}>{schedule.crop}</Text>
        <View style={styles.stageBadge}>
          <Text style={styles.stageText}>{schedule.stage}</Text>
        </View>
      </View>
      <Text style={styles.nextStage}>Next: {schedule.nextStage}</Text>
      <View style={styles.tasksList}>
        {schedule.tasks.slice(0, 2).map((task: string, index: number) => (
          <View key={index} style={styles.cropTask}>
            <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
            <Text style={styles.cropTaskText} numberOfLines={1}>{task}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/activities/new')} // Assuming this is correct
        >
          <Ionicons name="add" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
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
        {/* Week Calendar */}
        <View style={styles.weekCard}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekScrollContent}
          >
            {weekDates.map((day) => {
              const dayTasks = tasks.filter(task => task.date === day.date);
              const hasTasks = dayTasks.length > 0;
              const hasHighPriority = dayTasks.some(task => task.priority === 'high' && !task.completed);
              
              return (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.dayButton,
                    selectedDate === day.date && styles.dayButtonSelected,
                    day.isToday && styles.dayButtonToday,
                  ]}
                  onPress={() => setSelectedDate(day.date)}
                >
                  <Text style={[
                    styles.dayText,
                    selectedDate === day.date && styles.dayTextSelected,
                    day.isToday && !day.isToday && styles.dayTextToday,
                  ]}>
                    {day.day}
                  </Text>
                  <Text style={[
                    styles.dateNumber,
                    selectedDate === day.date && styles.dateNumberSelected,
                    day.isToday && !day.isToday && styles.dateNumberToday,
                  ]}>
                    {day.number}
                  </Text>
                  <View style={styles.taskIndicators}>
                    {hasHighPriority && <View style={[styles.highPriorityIndicator, { backgroundColor: colors.error }]} />}
                    {hasTasks && !hasHighPriority && <View style={[styles.taskIndicator, { backgroundColor: colors.info }]} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[ styles.toggleButton, view === 'tasks' && styles.toggleButtonActive ]}
            onPress={() => setView('tasks')}
          >
            <Ionicons name="list" size={16} color={view === 'tasks' ? colors.background : colors.textSecondary} />
            <Text style={[ styles.toggleText, view === 'tasks' && styles.toggleTextActive ]}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[ styles.toggleButton, view === 'events' && styles.toggleButtonActive ]}
            onPress={() => setView('events')}
          >
            <Ionicons name="calendar" size={16} color={view === 'events' ? colors.background : colors.textSecondary} />
            <Text style={[ styles.toggleText, view === 'events' && styles.toggleTextActive ]}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[ styles.toggleButton, view === 'schedule' && styles.toggleButtonActive ]}
            onPress={() => setView('schedule')}
          >
            <Ionicons name="leaf" size={16} color={view === 'schedule' ? colors.background : colors.textSecondary} />
            <Text style={[ styles.toggleText, view === 'schedule' && styles.toggleTextActive ]}>Crops</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Date Header */}
        <View style={styles.dateHeader}>
          <Text style={styles.dateTitle}>
            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
          <Text style={styles.dateSubtitle}>
            {view === 'tasks' && `${dailyTasks.length} ${dailyTasks.length === 1 ? 'task' : 'tasks'}`}
            {view === 'events' && `${dailyEvents.length} ${dailyEvents.length === 1 ? 'event' : 'events'}`}
            {view === 'schedule' && 'Crop schedule'}
          </Text>
        </View>

        {/* Tasks View */}
        {view === 'tasks' && (
          <View style={styles.contentSection}>
            {dailyTasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-done" size={48} color={colors.border} />
                <Text style={styles.emptyTitle}>No Tasks Today</Text>
                <Text style={styles.emptyDescription}>All caught up! Add new tasks to stay organized.</Text>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => router.push('/activities/new')}
                >
                  <Ionicons name="add" size={16} color={colors.background} />
                  <Text style={styles.primaryButtonText}>Add Task</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.tasksList}>
                {dailyTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Events View */}
        {view === 'events' && (
          <View style={styles.contentSection}>
            {dailyEvents.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={colors.border} />
                <Text style={styles.emptyTitle}>No Events</Text>
                <Text style={styles.emptyDescription}>No events scheduled for this day.</Text>
              </View>
            ) : (
              <View style={styles.eventsList}>
                {dailyEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Crop Schedule View */}
        {view === 'schedule' && (
          <View style={styles.contentSection}>
            <View style={styles.cropSchedules}>
              {cropSchedules.map((schedule, index) => (
                <CropScheduleItem key={index} schedule={schedule} />
              ))}
            </View>
          </View>
        )}

        {/* Quick Stats - This was missing */}
        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{tasks.filter(t => !t.completed).length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{tasks.filter(t => t.completed).length}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{tasks.filter(t => t.priority === 'high' && !t.completed).length}</Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
        </View>

        {/* Quick Actions - This was missing */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/activities/new')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}33` }]}>
              <Ionicons name="add" size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Add Task</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/tips')} // Assuming path
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.info}33` }]}>
              <Ionicons name="book" size={20} color={colors.info} />
            </View>
            <Text style={styles.quickActionText}>Tips</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/alerts')} // Assuming path
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${colors.warning}33` }]}>
              <Ionicons name="notifications" size={20} color={colors.warning} />
            </View>
            <Text style={styles.quickActionText}>Reminders</Text>
          </TouchableOpacity>
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
  addButton: {
    padding: 4,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  weekCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekScrollContent: {
    paddingHorizontal: 4,
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: isSmallScreen ? 10 : 12,
    borderRadius: 10,
    backgroundColor: colors.background,
    marginHorizontal: 2,
    minWidth: isSmallScreen ? 44 : 48,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
  },
  dayButtonToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dayText: {
    color: colors.textSecondary,
    fontSize: isSmallScreen ? 10 : 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayTextSelected: {
    color: colors.background,
  },
  dayTextToday: {
    color: colors.primary,
  },
  dateNumber: {
    color: colors.text,
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dateNumberSelected: {
    color: colors.background,
  },
  dateNumberToday: {
    color: colors.primary,
  },
  taskIndicators: {
    flexDirection: 'row',
    gap: 2,
    height: 3,
  },
  taskIndicator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  highPriorityIndicator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 3,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 4,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: isSmallScreen ? 12 : 13,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.background,
  },
  dateHeader: {
    marginVertical: 12,
  },
  dateTitle: {
    color: colors.text,
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dateSubtitle: {
    color: colors.primary,
    fontSize: isSmallScreen ? 12 : 13,
  },
  contentSection: {
    marginBottom: 16,
  },
  tasksList: {
    gap: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderColor: colors.border, // Default border, will be overridden by priority
  },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  taskIconText: {
    fontSize: 16,
  },
  taskContent: {
    flex: 1,
    marginRight: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  taskTitle: {
    color: colors.text,
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 6,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  taskCrop: {
    color: colors.textSecondary,
    fontSize: isSmallScreen ? 11 : 12,
    marginBottom: 2,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTime: {
    color: colors.primary,
    fontSize: isSmallScreen ? 10 : 11,
    fontWeight: '600',
  },
  taskDuration: {
    color: colors.textSecondary,
    fontSize: isSmallScreen ? 10 : 11,
    marginLeft: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  eventsList: {
    gap: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
  },
  eventIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  eventIconText: {
    fontSize: 16,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    color: colors.text,
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventDescription: {
    color: colors.textSecondary,
    fontSize: isSmallScreen ? 11 : 12,
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    color: colors.textSecondary,
    fontSize: isSmallScreen ? 10 : 11,
    marginLeft: 4,
  },
  cropSchedules: {
    gap: 8,
  },
  cropScheduleItem: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cropName: {
    color: colors.text,
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: 'bold',
  },
  stageBadge: {
    backgroundColor: `${colors.primary}33`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stageText: {
    color: colors.primary,
    fontSize: isSmallScreen ? 10 : 11,
    fontWeight: '600',
  },
  nextStage: {
    color: colors.textSecondary,
    fontSize: isSmallScreen ? 11 : 12,
    marginBottom: 8,
  },
  cropTask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cropTaskText: {
    color: colors.textSecondary,
    fontSize: isSmallScreen ? 11 : 12,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
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
    marginBottom: 16,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: colors.primary,
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: isSmallScreen ? 10 : 11,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAction: {
    flex: 1,
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
    fontSize: isSmallScreen ? 11 : 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});