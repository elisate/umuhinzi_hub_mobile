import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors, ThemeColors } from '../../constants/theme'; 

export default function NewCropScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    type: '',
    variety: '',
    plantingDate: '',
    area: '',
    location: '',
    soilType: '',
    notes: '',
    remindersEnabled: true,
  });

  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  const cropTypes = ['Maize', 'Beans', 'Coffee', 'Potatoes', 'Bananas', 'Vegetables', 'Fruits', 'Other'];

  const handleSave = () => {
    if (!form.name || !form.type) {
      Alert.alert('Missing Information', 'Please fill in at least crop name and type.');
      return;
    }

    // Simulate saving
    Alert.alert(
      'Crop Added',
      `${form.name} has been added to your farm!`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const updateForm = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Crop</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Crop Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Crop Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Maize Field 1"
              value={form.name}
              onChangeText={(value) => updateForm('name', value)}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Crop Type *</Text>
            <View style={styles.typeGrid}>
              {cropTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    form.type === type && styles.typeButtonSelected,
                  ]}
                  onPress={() => updateForm('type', type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      form.type === type && styles.typeButtonTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Variety (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Hybrid 621"
              value={form.variety}
              onChangeText={(value) => updateForm('variety', value)}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Planting Date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={form.plantingDate}
              onChangeText={(value) => updateForm('plantingDate', value)}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Area (Acres/Ha)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 2.5"
                value={form.area}
                onChangeText={(value) => updateForm('area', value)}
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Soil Type</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Loam"
                value={form.soilType}
                onChangeText={(value) => updateForm('soilType', value)}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location/Field</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., North Field"
              value={form.location}
              onChangeText={(value) => updateForm('location', value)}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional notes about this crop..."
              value={form.notes}
              onChangeText={(value) => updateForm('notes', value)}
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.switchGroup}>
            <View>
              <Text style={styles.label}>Enable Reminders</Text>
              <Text style={styles.switchSubtitle}>Get notifications for important tasks</Text>
            </View>
            <Switch
              value={form.remindersEnabled}
              onValueChange={(value) => updateForm('remindersEnabled', value)}
              trackColor={{ false: colors.gray300, true: `${colors.primary}80` }}
              thumbColor={form.remindersEnabled ? colors.primary : colors.gray100}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.primaryButton,
              (!form.name || !form.type) && styles.primaryButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!form.name || !form.type}
          >
            <Ionicons name="save-outline" size={20} color={colors.background} />
            <Text style={styles.primaryButtonText}>Save Crop</Text>
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
  placeholder: {
    width: 34,
  },
  container: {
    flex: 1,
    padding: 15,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: colors.background, // This creates good contrast on both light/dark primary
    fontWeight: 'bold',
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  switchSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: colors.background, // Contrast color
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});