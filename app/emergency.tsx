import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext'; // Adjust path
import { getThemeColors, ThemeColors } from '../constants/theme'; // Adjust path

// Theme-aware data creators
const createEmergencyContacts = (colors: ThemeColors) => [
  { id: '1', name: 'Emergency Helpline', number: '112', type: 'General Emergency', icon: 'call', color: colors.error },
  { id: '2', name: 'Agriculture Dept.', number: '0800-222-333', type: 'Crop Emergency', icon: 'leaf', color: colors.primary },
  { id: '3', name: 'Pest Control Unit', number: '0800-444-555', type: 'Pest Outbreak', icon: 'bug', color: colors.warning },
  { id: '4', name: 'Veterinary Services', number: '0800-666-777', type: 'Livestock Emergency', icon: 'paw', color: colors.info },
];

const createEmergencyProcedures = (colors: ThemeColors) => [
  { id: '1', title: 'Pest Outbreak', steps: [ 'Isolate affected plants', 'Take photos for identification', 'Contact agriculture officer', 'Apply recommended treatment' ], icon: '🐛', color: colors.warning },
  { id: '2', title: 'Crop Disease', steps: [ 'Stop irrigation to prevent spread', 'Collect samples for testing', 'Quarantine affected area', 'Use approved fungicides' ], icon: '🦠', color: colors.error },
  { id: '3', title: 'Weather Emergency', steps: [ 'Secure crops and equipment', 'Harvest mature crops if possible', 'Implement drainage measures', 'Monitor weather updates' ], icon: '⛈️', color: colors.info },
  { id: '4', title: 'Chemical Spill', steps: [ 'Evacuate area immediately', 'Use protective equipment', 'Contain the spill', 'Contact emergency services' ], icon: '⚠️', color: colors.error },
];

export default function EmergencyScreen() {
  const router = useRouter();

  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  // --- THEME-AWARE DATA ---
  const emergencyContacts = createEmergencyContacts(colors);
  const emergencyProcedures = createEmergencyProcedures(colors);
  // ---

  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);

  const handleCall = (number: string) => {
    Alert.alert('Call Emergency', `Do you want to call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Assistance</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Emergency Alert Banner */}
        <View style={styles.alertBanner}>
          <View style={styles.alertIcon}>
            <Ionicons name="warning" size={32} color={colors.black} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Emergency Mode</Text>
            <Text style={styles.alertSubtitle}>Immediate assistance and guidance</Text>
          </View>
        </View>

        {/* Quick Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="call-outline" size={20} color={colors.error} /> Emergency Contacts
          </Text>
          <Text style={styles.sectionSubtitle}>Tap to call services immediately</Text>
          <View style={styles.contactsGrid}>
            {emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactCard}
                onPress={() => handleCall(contact.number)}
              >
                <View style={[styles.contactIcon, { backgroundColor: `${contact.color}33` }]}>
                  <Ionicons name={contact.icon as any} size={24} color={contact.color} />
                </View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactType}>{contact.type}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
                <View style={styles.callButton}>
                  <Ionicons name="call" size={16} color={colors.white} />
                  <Text style={styles.callButtonText}>Call Now</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Procedures */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="medical-outline" size={20} color={colors.primary} /> Emergency Procedures
          </Text>
          <Text style={styles.sectionSubtitle}>Follow these steps for common emergencies</Text>
          {emergencyProcedures.map((procedure) => (
            <TouchableOpacity
              key={procedure.id}
              style={styles.procedureCard}
              onPress={() => setSelectedProcedure(selectedProcedure === procedure.id ? null : procedure.id)}
            >
              <View style={styles.procedureHeader}>
                <View style={styles.procedureTitleSection}>
                  <Text style={styles.procedureIcon}>{procedure.icon}</Text>
                  <View>
                    <Text style={styles.procedureTitle}>{procedure.title}</Text>
                    <Text style={styles.procedureSubtitle}>{procedure.steps.length} emergency steps</Text>
                  </View>
                </View>
                <Ionicons name={selectedProcedure === procedure.id ? "chevron-up" : "chevron-down"} size={20} color={colors.textSecondary} />
              </View>
              {selectedProcedure === procedure.id && (
                <View style={styles.procedureSteps}>
                  {procedure.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={[styles.stepNumber, { backgroundColor: procedure.color }]}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions - This was missing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="flash-outline" size={20} color={colors.info} /> Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/chat')}>
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}33` }]}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Message AURA</Text>
              <Text style={styles.quickActionSubtext}>Get AI Assistance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/scan')}>
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.info}33` }]}>
                <Ionicons name="camera-outline" size={24} color={colors.info} />
              </View>
              <Text style={styles.quickActionText}>Scan Problem</Text>
              <Text style={styles.quickActionSubtext}>Identify Issue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => Linking.openURL('sms:?body=EMERGENCY: Need immediate agricultural assistance')}>
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.error}33` }]}>
                <Ionicons name="alert-circle-outline" size={24} color={colors.error} />
              </View>
              <Text style={styles.quickActionText}>Send Alert</Text>
              <Text style={styles.quickActionSubtext}>Quick SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/pests')}>
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.warning}33` }]}>
                <MaterialCommunityIcons name="bug-outline" size={24} color={colors.warning} />
              </View>
              <Text style={styles.quickActionText}>Pest Library</Text>
              <Text style={styles.quickActionSubtext}>Identify Pests</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Safety Information - This was missing */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyHeader}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
            <Text style={styles.safetyTitle}>Safety First</Text>
          </View>
          <View style={styles.safetyTips}>
            <View style={styles.safetyTip}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.safetyTipText}>Wear protective equipment when handling chemicals</Text>
            </View>
            <View style={styles.safetyTip}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.safetyTipText}>Keep emergency numbers saved in your phone</Text>
            </View>
            <View style={styles.safetyTip}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.safetyTipText}>Have a first aid kit readily available</Text>
            </View>
            <View style={styles.safetyTip}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.safetyTipText}>Know the location of nearest medical facility</Text>
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
    padding: 16,
  },
  alertBanner: {
    backgroundColor: colors.warning,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: colors.black, // Use black for contrast on warning bg
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertSubtitle: {
    color: colors.black,
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  contactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  contactCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  contactType: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
  },
  contactNumber: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  callButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callButtonText: {
    color: colors.white, // Explicit white for button
    fontSize: 12,
    fontWeight: 'bold',
  },
  procedureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  procedureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  procedureTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  procedureIcon: {
    fontSize: 24,
  },
  procedureTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  procedureSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  procedureSteps: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    color: colors.white, // Assuming light text on colored bg
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAction: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtext: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  safetyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  safetyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  safetyTips: {
    gap: 12,
  },
  safetyTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  safetyTipText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
