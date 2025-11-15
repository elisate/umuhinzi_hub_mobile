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

export default function TermsScreen() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using UmuhinziHub, you accept and agree to be bound by the terms and provision of this agreement."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily use UmuhinziHub for personal, non-commercial transitory viewing only."
    },
    {
      title: "3. Farmer Account",
      content: "You must provide accurate information when creating your account and are responsible for maintaining the security of your account."
    },
    {
      title: "4. Marketplace Rules",
      content: "All transactions through our marketplace must comply with local agricultural regulations and fair trade practices."
    },
    {
      title: "5. AI Recommendations",
      content: "Our AI provides farming suggestions, but ultimate decisions and their consequences are your responsibility."
    },
    {
      title: "6. Data Collection",
      content: "We collect necessary data to improve our services while protecting your privacy in accordance with our Privacy Policy."
    },
    {
      title: "7. Intellectual Property",
      content: "All content and technology on UmuhinziHub are owned by us or our licensors and are protected by copyright laws."
    },
    {
      title: "8. User Content",
      content: "You retain rights to content you post but grant us license to use it for service improvement and community features."
    },
    {
      title: "9. Termination",
      content: "We may terminate or suspend access to our service immediately for violation of these terms without prior notice."
    },
    {
      title: "10. Changes to Terms",
      content: "We reserve the right to modify these terms at any time. Continued use constitutes acceptance of changes."
    },
    {
      title: "11. Contact Information",
      content: "Questions about these terms should be sent to legal@umuhinzihub.rw"
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
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Last Updated */}
        <View style={styles.updateSection}>
          <Ionicons name="time-outline" size={16} color="#00FF88" />
          <Text style={styles.updateText}>Last updated: December 2024</Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.introTitle}>
            Welcome to UmuhinziHub
          </Text>
          <Text style={styles.introText}>
            These terms and conditions outline the rules and regulations for the use of UmuhinziHubs mobile application and services.
          </Text>
        </View>

        {/* Terms Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <View key={index} style={styles.termSection}>
              <Text style={styles.termTitle}>{section.title}</Text>
              <Text style={styles.termContent}>{section.content}</Text>
            </View>
          ))}
        </View>

        {/* Agreement */}
        <View style={styles.agreementSection}>
          <View style={styles.agreementIcon}>
            <Ionicons name="shield-checkmark" size={32} color="#00FF88" />
          </View>
          <Text style={styles.agreementTitle}>Your Agreement</Text>
          <Text style={styles.agreementText}>
            By using UmuhinziHub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </Text>
        </View>

        {/* Contact Legal */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Questions about our Terms?</Text>
          <Text style={styles.contactText}>
            If you have any questions about these Terms of Service, please contact our legal team.
          </Text>
          <View style={styles.contactInfo}>
            <Ionicons name="mail" size={16} color="#00FF88" />
            <Text style={styles.contactEmail}>legal@umuhinzihub.rw</Text>
          </View>
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
  sectionsContainer: {
    padding: 20,
    gap: 20,
  },
  termSection: {
    backgroundColor: "#1E261E",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2D4A3A",
  },
  termTitle: {
    color: "#00FF88",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  termContent: {
    color: "#A7F3D0",
    fontSize: 14,
    lineHeight: 20,
  },
  agreementSection: {
    margin: 20,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.3)",
    alignItems: "center",
  },
  agreementIcon: {
    marginBottom: 12,
  },
  agreementTitle: {
    color: "#00FF88",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  agreementText: {
    color: "#A7F3D0",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
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
});