import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function PrivacyScreen() {
  const sections = [
    {
      title: "Information We Collect",
      content: "We collect farm data, location information, crop photos, and usage data to provide personalized farming recommendations and improve our services."
    },
    {
      title: "How We Use Your Information",
      content: "Your data helps us provide AI-powered farming advice, connect you with buyers, deliver weather forecasts, and improve our app features."
    },
    {
      title: "Data Sharing",
      content: "We only share essential information with verified buyers through our marketplace and may share anonymized data for agricultural research purposes."
    },
    {
      title: "Data Security",
      content: "We implement industry-standard security measures to protect your personal and farming data from unauthorized access or disclosure."
    },
    {
      title: "Your Rights",
      content: "You can access, correct, or delete your personal data at any time through the app settings or by contacting us directly."
    },
    {
      title: "Location Data",
      content: "We collect location data to provide hyper-local weather forecasts and connect you with nearby buyers and farming resources."
    },
    {
      title: "Cookies & Tracking",
      content: "We use minimal tracking to improve app performance and user experience, but we don't sell your data to third-party advertisers."
    },
    {
      title: "Children's Privacy",
      content: "Our services are not directed to individuals under 18. We don't knowingly collect personal information from children."
    },
    {
      title: "Data Retention",
      content: "We retain your data only as long as necessary to provide our services or as required by Rwandan agricultural regulations."
    },
    {
      title: "Changes to This Policy",
      content: "We may update this privacy policy. We will notify you of any changes by posting the new policy on this page."
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#00FF88" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Last Updated */}
        <View style={styles.updateSection}>
          <Ionicons name="shield-checkmark" size={16} color="#00FF88" />
          <Text style={styles.updateText}>Last updated: December 2024</Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.introTitle}>
            Your Privacy Matters
          </Text>
          <Text style={styles.introText}>
            At UmuhinziHub, we are committed to protecting your privacy and being transparent about how we handle your farming data.
          </Text>
        </View>

        {/* Key Privacy Points */}
        <View style={styles.keyPoints}>
          <View style={styles.keyPoint}>
            <Ionicons name="lock-closed" size={20} color="#00FF88" />
            <Text style={styles.keyPointText}>Data Protected</Text>
          </View>
          <View style={styles.keyPoint}>
            <Ionicons name="eye-off" size={20} color="#00FF88" />
            <Text style={styles.keyPointText}>No Data Selling</Text>
          </View>
          <View style={styles.keyPoint}>
            <Ionicons name="download" size={20} color="#00FF88" />
            <Text style={styles.keyPointText}>Export Your Data</Text>
          </View>
        </View>

        {/* Policy Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <View key={index} style={styles.policySection}>
              <Text style={styles.policyTitle}>{section.title}</Text>
              <Text style={styles.policyContent}>{section.content}</Text>
            </View>
          ))}
        </View>

        {/* Data Control */}
        <View style={styles.controlSection}>
          <View style={styles.controlIcon}>
            <Ionicons name="settings" size={32} color="#00FF88" />
          </View>
          <Text style={styles.controlTitle}>Youre in Control</Text>
          <Text style={styles.controlText}>
            Manage your privacy settings in the app to control what data you share and how its used for your farming operations.
          </Text>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlButtonText}>Open Privacy Settings</Text>
            <Ionicons name="arrow-forward" size={16} color="#00FF88" />
          </TouchableOpacity>
        </View>

        {/* Contact Privacy Team */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Privacy Questions?</Text>
          <Text style={styles.contactText}>
            If you have any questions about our privacy practices or your data, our privacy team is here to help.
          </Text>
          <View style={styles.contactInfo}>
            <Ionicons name="mail" size={16} color="#00FF88" />
            <Text style={styles.contactEmail}>privacy@umuhinzihub.rw</Text>
          </View>
        </View>

        {/* Compliance */}
        <View style={styles.complianceSection}>
          <Text style={styles.complianceTitle}>Compliance</Text>
          <Text style={styles.complianceText}>
            UmuhinziHub complies with Rwandan data protection regulations and agricultural data standards to ensure your information is handled responsibly.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0E1410",
  },
  container: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(14, 20, 16, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#1E3A2E",
  },
  backButton: {
    padding: 6,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderRadius: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 34,
  },
  updateSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    margin: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.3)",
    gap: 8,
  },
  updateText: {
    color: "#00FF88",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  introTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  introText: {
    color: "#A7F3D0",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  keyPoints: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  keyPoint: {
    alignItems: "center",
    gap: 6,
  },
  keyPointText: {
    color: "#00FF88",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionsContainer: {
    padding: 20,
    gap: 20,
  },
  policySection: {
    backgroundColor: "#1E261E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2D4A3A",
  },
  policyTitle: {
    color: "#00FF88",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  policyContent: {
    color: "#A7F3D0",
    fontSize: 14,
    lineHeight: 20,
  },
  controlSection: {
    margin: 20,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.3)",
    alignItems: "center",
  },
  controlIcon: {
    marginBottom: 12,
  },
  controlTitle: {
    color: "#00FF88",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  controlText: {
    color: "#A7F3D0",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 136, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.3)",
    gap: 6,
  },
  controlButtonText: {
    color: "#00FF88",
    fontSize: 14,
    fontWeight: "600",
  },
  contactSection: {
    margin: 20,
    padding: 20,
    backgroundColor: "#1E261E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2D4A3A",
    alignItems: "center",
  },
  contactTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  contactText: {
    color: "#A7F3D0",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 20,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contactEmail: {
    color: "#00FF88",
    fontSize: 14,
    fontWeight: "600",
  },
  complianceSection: {
    margin: 20,
    marginTop: 10,
    padding: 16,
    backgroundColor: "rgba(96, 165, 250, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.3)",
  },
  complianceTitle: {
    color: "#60A5FA",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  complianceText: {
    color: "#A7F3D0",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});