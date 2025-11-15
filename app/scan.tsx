import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext'; // Adjust path
import { getThemeColors, ThemeColors } from '../constants/theme'; // Adjust path

export default function ScanScreen() {
  const router = useRouter();

  // --- THEME ---
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);
  // ---

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera access to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResult(null);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to take photo', err as any);
    }
  };

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResult(null);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image', err as any);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const results = {
        plantType: 'Maize',
        confidence: '92%',
        health: 'Good', // Can be 'Good', 'Fair', 'Poor'
        issues: [
          { type: 'pest', name: 'Fall Armyworm', confidence: '85%', description: 'Small holes in leaves, visible larvae', treatment: 'Apply neem oil or recommended pesticide' },
          { type: 'nutrient', name: 'Nitrogen Deficiency', confidence: '78%', description: 'Yellowing of lower leaves', treatment: 'Apply nitrogen-rich fertilizer' }
        ],
        recommendations: [ 'Monitor for increased pest activity', 'Test soil nutrients', 'Consider crop rotation next season' ]
      };
      setAnalysisResult(results);
      setIsAnalyzing(false);
    }, 3000);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  // --- THEME-AWARE HELPER ---
  const getHealthStyle = (health: string) => {
    if (health === 'Good') {
      return {
        badge: { backgroundColor: `${colors.success}33` },
        text: { color: colors.success }
      };
    }
    if (health === 'Fair') {
      return {
        badge: { backgroundColor: `${colors.warning}33` },
        text: { color: colors.warning }
      };
    }
    // Default to 'Poor'
    return {
      badge: { backgroundColor: `${colors.error}33` },
      text: { color: colors.error }
    };
  };
  // ---

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Scan</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Scan Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scan Plant Health</Text>
          <Text style={styles.cardSubtitle}>
            Take a photo of your plant leaves to detect diseases, pests, and nutrient deficiencies
          </Text>

          {!selectedImage ? (
            <View style={styles.scanOptions}>
              <TouchableOpacity style={styles.scanOption} onPress={handleTakePhoto}>
                <View style={[styles.scanIcon, { backgroundColor: `${colors.primary}33` }]}>
                  <Ionicons name="camera" size={32} color={colors.primary} />
                </View>
                <Text style={styles.scanOptionTitle}>Take Photo</Text>
                <Text style={styles.scanOptionDesc}>Use camera to capture plant</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.scanOption} onPress={handlePickImage}>
                <View style={[styles.scanIcon, { backgroundColor: `${colors.info}33` }]}>
                  <Ionicons name="image" size={32} color={colors.info} />
                </View>
                <Text style={styles.scanOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.scanOptionDesc}>Select existing photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <View style={styles.imageActions}>
                <TouchableOpacity style={styles.imageAction} onPress={clearImage}>
                  <Ionicons name="close-circle" size={20} color={colors.error} />
                  <Text style={styles.imageActionText}>Retake</Text>
                </TouchableOpacity>
                {!analysisResult && (
                  <TouchableOpacity 
                    style={styles.analyzeButton}
                    onPress={analyzeImage}
                    disabled={isAnalyzing}
                  >
                    <Ionicons name="scan" size={20} color={colors.background} />
                    <Text style={styles.analyzeButtonText}>
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Analysis Results */}
        {isAnalyzing && (
          <View style={styles.card}>
            <View style={styles.analyzingContainer}>
              <Ionicons name="leaf" size={48} color={colors.primary} />
              <Text style={styles.analyzingTitle}>AURA is Analyzing</Text>
              <Text style={styles.analyzingSubtitle}>Checking for diseases, pests, and nutrient issues...</Text>
              {/* Add a real ActivityIndicator here if desired */}
            </View>
          </View>
        )}

        {analysisResult && (
          <View style={styles.resultsContainer}>
            {/* Plant Identification */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Plant Identification</Text>
              <View style={styles.plantInfo}>
                <View style={styles.plantBadge}>
                  <Text style={styles.plantName}>{analysisResult.plantType}</Text>
                  <Text style={styles.confidence}>{analysisResult.confidence} confidence</Text>
                </View>
                <View style={[styles.healthBadge, getHealthStyle(analysisResult.health).badge]}>
                  <Text style={[styles.healthText, getHealthStyle(analysisResult.health).text]}>
                    {analysisResult.health} Health
                  </Text>
                </View>
              </View>
            </View>

            {/* Detected Issues */}
            {analysisResult.issues.length > 0 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Detected Issues</Text>
                  <Text style={styles.issuesCount}>{analysisResult.issues.length} found</Text>
                </View>
                {analysisResult.issues.map((issue: any, index: number) => (
                  <View key={index} style={styles.issueItem}>
                    <View style={styles.issueHeader}>
                      <View style={styles.issueType}>
                        <Ionicons 
                          name={issue.type === 'pest' ? 'bug' : 'flask'} 
                          size={16} 
                          color={colors.error} 
                        />
                        <Text style={styles.issueName}>{issue.name}</Text>
                      </View>
                      <Text style={styles.issueConfidence}>{issue.confidence}</Text>
                    </View>
                    <Text style={styles.issueDescription}>{issue.description}</Text>
                    <View style={styles.treatment}>
                      <Text style={styles.treatmentLabel}>Treatment:</Text>
                      <Text style={styles.treatmentText}>{issue.treatment}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Recommendations */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>AURA Recommendations</Text>
              {analysisResult.recommendations.map((rec: string, index: number) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={clearImage}
              >
                <Text style={styles.secondaryButtonText}>Scan Another</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => router.push('/(tabs)/chat')} // Corrected path
              >
                <Ionicons name="chatbubble-ellipses" size={20} color={colors.background} />
                <Text style={styles.primaryButtonText}>Ask AURA</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tips */}
        {!selectedImage && !analysisResult && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Scanning Tips</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Ionicons name="sunny" size={20} color={colors.warning} />
                <Text style={styles.tipText}>Take photos in good lighting</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="crop" size={20} color={colors.primary} />
                <Text style={styles.tipText}>Focus on affected leaves or areas</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="camera" size={20} color={colors.info} />
                <Text style={styles.tipText}>Keep camera steady for clear images</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="leaf" size={20} color={colors.primary} />
                <Text style={styles.tipText}>Include both healthy and affected parts</Text>
              </View>
            </View>
          </View>
        )}
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
    marginBottom: 8,
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  scanOptions: {
    flexDirection: 'row',
    gap: 15,
  },
  scanOption: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  scanIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanOptionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  scanOptionDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  imagePreview: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: colors.gray100,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  imageAction: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageActionText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  analyzeButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  analyzingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  analyzingTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  analyzingSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 0.8 },
  resultsContainer: {
    gap: 15,
  },
  plantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantBadge: {
    alignItems: 'flex-start',
  },
  plantName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  confidence: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  healthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  healthText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  issuesCount: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  issueItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  issueName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  issueConfidence: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  issueDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  treatment: {
    backgroundColor: `${colors.error}26`,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  treatmentLabel: {
    color: colors.error,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  treatmentText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 18,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    padding: 12,
    backgroundColor: `${colors.primary}26`,
    borderRadius: 8,
  },
  recommendationText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
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
  primaryButtonText: {
    color: colors.background,
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