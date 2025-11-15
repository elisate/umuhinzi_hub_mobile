import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext"; // Assuming contexts/ is one level up
import { getThemeColors, ThemeColors } from "../constants/theme"; // Assuming constants/ is one level up

const { width: screenWidth } = Dimensions.get('window');

// --- Helper function moved outside component ---
const openLink = (url: string) => {
  Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
};

// --- Data moved outside component ---
const teamMembers = [
  {
    id: 1,
    name: "Alice M.",
    role: "Founder & CEO",
    avatar: "👩‍💼",
    description: "Agriculture Tech Expert"
  },
  {
    id: 2,
    name: "David K.",
    role: "Head of Product",
    avatar: "👨‍💻",
    description: "Software Engineer"
  },
  {
    id: 3,
    name: "Grace U.",
    role: "Agronomy Lead",
    avatar: "👩‍🌾",
    description: "Agricultural Scientist"
  },
  {
    id: 4,
    name: "James T.",
    role: "Community Manager",
    avatar: "👨‍🤝‍👨",
    description: "Farmer Relations"
  }
];

// --- Interface for type safety ---
interface Feature {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "weather-partly-cloudy",
    title: "AI Weather Intelligence",
    description: "Real-time hyper-local forecasts"
  },
  {
    icon: "shopping",
    title: "Digital Marketplace",
    description: "Direct buyer connections"
  },
  {
    icon: "robot",
    title: "AURA AI Assistant",
    description: "24/7 farming guidance"
  },
  {
    icon: "camera",
    title: "Plant Disease Detection",
    description: "Instant crop health analysis"
  }
];

export default function ModernAboutScreen() {
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors, screenWidth);

  // Use useRef for animated values to prevent re-creation on render
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Animated Background */}
      <View style={styles.backgroundOverlay}>
        <Animated.View style={[styles.floatingOrb, styles.orb1]} />
        <Animated.View style={[styles.floatingOrb, styles.orb2]} />
        <Animated.View style={[styles.floatingOrb, styles.orb3]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Us</Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => {/* Share functionality */}}
          >
            <Ionicons name="share-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Ionicons name="sparkles" size={16} color={colors.primary} />
                <Text style={styles.heroBadgeText}>Transforming Agriculture</Text>
              </View>
              
              <Text style={styles.heroTitle}>
                Empowering Farmers Through{"\n"}
                <Text style={styles.heroTitleHighlight}>Technology</Text>
              </Text>
              
              <Text style={styles.heroDescription}>
                UmuhinziHub is revolutionizing African agriculture by connecting farmers with cutting-edge technology, market access, and community support.
              </Text>

              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNumber}>50K+</Text>
                  <Text style={styles.heroStatLabel}>Farmers</Text>
                </View>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNumber}>40%</Text>
                  <Text style={styles.heroStatLabel}>Yield Increase</Text>
                </View>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatNumber}>95%</Text>
                  <Text style={styles.heroStatLabel}>Satisfaction</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Mission & Vision */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Purpose</Text>
              <Text style={styles.sectionSubtitle}>
                Driving agricultural transformation in Africa
              </Text>
            </View>

            <View style={styles.purposeGrid}>
              <View style={styles.purposeCard}>
                <View style={styles.purposeIcon}>
                  <MaterialCommunityIcons name="target" size={28} color={colors.primary} />
                </View>
                <Text style={styles.purposeTitle}>Mission</Text>
                <Text style={styles.purposeDescription}>
                  Empower smallholder farmers with AI-driven insights, market access, and sustainable farming practices.
                </Text>
              </View>

              <View style={styles.purposeCard}>
                <View style={[styles.purposeIcon, { backgroundColor: `${colors.info}1A` }]}>
                  <MaterialCommunityIcons name="eye" size={28} color={colors.info} />
                </View>
                <Text style={styles.purposeTitle}>Vision</Text>
                <Text style={styles.purposeDescription}>
                  Create a future where every African farmer thrives through technology and community support.
                </Text>
              </View>
            </View>
          </View>

          {/* Core Values */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Values</Text>
              <Text style={styles.sectionSubtitle}>
                The principles that guide everything we do
              </Text>
            </View>

            <View style={styles.valuesGrid}>
              <View style={styles.valueItem}>
                <View style={[styles.valueIcon, { backgroundColor: `${colors.primary}33` }]}>
                  <MaterialCommunityIcons name="leaf" size={24} color={colors.primary} />
                </View>
                <Text style={styles.valueTitle}>Sustainability</Text>
                <Text style={styles.valueDescription}>Environmentally conscious farming</Text>
              </View>

              <View style={styles.valueItem}>
                <View style={[styles.valueIcon, { backgroundColor: `${colors.info}33` }]}>
                  <MaterialCommunityIcons name="handshake" size={24} color={colors.info} />
                </View>
                <Text style={styles.valueTitle}>Community</Text>
                <Text style={styles.valueDescription}>Farmer-first approach</Text>
              </View>

              <View style={styles.valueItem}>
                <View style={[styles.valueIcon, { backgroundColor: `${colors.warning}33` }]}>
                  <MaterialCommunityIcons name="lightbulb-on" size={24} color={colors.warning} />
                </View>
                <Text style={styles.valueTitle}>Innovation</Text>
                <Text style={styles.valueDescription}>Cutting-edge technology</Text>
              </View>

              <View style={styles.valueItem}>
                <View style={[styles.valueIcon, { backgroundColor: `${colors.textSecondary}33` }]}>
                  <MaterialCommunityIcons name="shield-check" size={24} color={colors.textSecondary} />
                </View>
                <Text style={styles.valueTitle}>Trust</Text>
                <Text style={styles.valueDescription}>Reliable and transparent</Text>
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>What We Offer</Text>
              <Text style={styles.sectionSubtitle}>
                Comprehensive farming solutions
              </Text>
            </View>

            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <View style={styles.featureIcon}>
                    <MaterialCommunityIcons name={feature.icon} size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Impact Stats */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Impact</Text>
              <Text style={styles.sectionSubtitle}>
                Making a difference in farmers lives
              </Text>
            </View>

            <View style={styles.impactStats}>
              <View style={styles.impactStat}>
                <Text style={styles.impactNumber}>50,000+</Text>
                <Text style={styles.impactLabel}>Active Farmers</Text>
              </View>
              <View style={styles.impactStat}>
                <Text style={styles.impactNumber}>40%</Text>
                <Text style={styles.impactLabel}>Average Yield Increase</Text>
              </View>
              <View style={styles.impactStat}>
                <Text style={styles.impactNumber}>200+</Text>
                <Text style={styles.impactLabel}>Communities Served</Text>
              </View>
              <View style={styles.impactStat}>
                <Text style={styles.impactNumber}>95%</Text>
                <Text style={styles.impactLabel}>Farmer Satisfaction</Text>
              </View>
            </View>
          </View>

          {/* Team Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Team</Text>
              <Text style={styles.sectionSubtitle}>
                Passionate experts driving change
              </Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.teamScroll}
              contentContainerStyle={styles.teamScrollContent}
            >
              {teamMembers.map((member) => (
                <View key={member.id} style={styles.teamCard}>
                  <Text style={styles.teamAvatar}>{member.avatar}</Text>
                  <Text style={styles.teamName}>{member.name}</Text>
                  <Text style={styles.teamRole}>{member.role}</Text>
                  <Text style={styles.teamDescription}>{member.description}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Technology Stack */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Technology</Text>
              <Text style={styles.sectionSubtitle}>
                Powered by cutting-edge solutions
              </Text>
            </View>

            <View style={styles.techGrid}>
              <View style={styles.techItem}>
                <View style={[styles.techIcon, { backgroundColor: `${colors.info}1A` }]}>
                  <Ionicons name="cloud" size={24} color={colors.info} />
                </View>
                <Text style={styles.techTitle}>AI & Machine Learning</Text>
                <Text style={styles.techDescription}>Smart crop predictions</Text>
              </View>

              <View style={styles.techItem}>
                <View style={[styles.techIcon, { backgroundColor: `${colors.primary}1A` }]}>
                  <Ionicons name="phone-portrait" size={24} color={colors.primary} />
                </View>
                <Text style={styles.techTitle}>Mobile First</Text>
                <Text style={styles.techDescription}>Accessible anywhere</Text>
              </View>

              <View style={styles.techItem}>
                <View style={[styles.techIcon, { backgroundColor: `${colors.warning}1A` }]}>
                  <MaterialCommunityIcons name="satellite-variant" size={24} color={colors.warning} />
                </View>
                <Text style={styles.techTitle}>Satellite Data</Text>
                <Text style={styles.techDescription}>Precision agriculture</Text>
              </View>

              <View style={styles.techItem}>
                <View style={[styles.techIcon, { backgroundColor: `${colors.textSecondary}1A` }]}>
                  <FontAwesome5 name="robot" size={20} color={colors.textSecondary} />
                </View>
                <Text style={styles.techTitle}>AURA AI</Text>
                <Text style={styles.techDescription}>24/7 Assistance</Text>
              </View>
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.section}>
            <View style={styles.ctaCard}>
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>Join the Revolution</Text>
                <Text style={styles.ctaDescription}>
                  Be part of Africas agricultural transformation. Start your journey with UmuhinziHub today.
                </Text>
                
                <View style={styles.ctaButtons}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push("/SignUp")}
                  >
                    <Text style={styles.primaryButtonText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={18} color={colors.background} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push("/tips")}
                  >
                    <Text style={styles.secondaryButtonText}>Learn More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Get In Touch</Text>
              <Text style={styles.sectionSubtitle}>
                Wed love to hear from you
              </Text>
            </View>

            <View style={styles.contactGrid}>
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => openLink('mailto:info@umuhinzihub.rw')}
              >
                <View style={[styles.contactIcon, { backgroundColor: `${colors.primary}33` }]}>
                  <Ionicons name="mail" size={20} color={colors.primary} />
                </View>
                <Text style={styles.contactTitle}>Email</Text>
                <Text style={styles.contactValue}>info@umuhinzihub.rw</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => openLink('tel:+250788123456')}
              >
                <View style={[styles.contactIcon, { backgroundColor: `${colors.info}33` }]}>
                  <Ionicons name="call" size={20} color={colors.info} />
                </View>
                <Text style={styles.contactTitle}>Phone</Text>
                <Text style={styles.contactValue}>+250 788 123 456</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => openLink('https://maps.google.com/?q=Kigali,Rwanda')}
              >
                <View style={[styles.contactIcon, { backgroundColor: `${colors.warning}33` }]}>
                  <Ionicons name="location" size={20} color={colors.warning} />
                </View>
                <Text style={styles.contactTitle}>Location</Text>
                <Text style={styles.contactValue}>Kigali, Rwanda</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => openLink('https://wa.me/250788123456')}
              >
                {/* Brand colors can be kept hardcoded if not part of the theme */}
                <View style={[styles.contactIcon, { backgroundColor: 'rgba(37, 211, 102, 0.2)' }]}>
                  <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                </View>
                <Text style={styles.contactTitle}>WhatsApp</Text>
                <Text style={styles.contactValue}>Chat with us</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <View style={styles.footerLogo}>
                <View style={styles.logoIcon}>
                  <Ionicons name="leaf" size={24} color={colors.background} />
                </View>
                <Text style={styles.logoText}>UmuhinziHub</Text>
              </View>
              
              <Text style={styles.footerTagline}>
                Empowering African farmers through technology and innovation.
              </Text>

              <View style={styles.socialLinks}>
                <TouchableOpacity 
                  style={styles.socialLink}
                  onPress={() => openLink('https://facebook.com/umuhinzihub')}
                >
                  <Ionicons name="logo-facebook" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.socialLink}
                  onPress={() => openLink('https://twitter.com/umuhinzihub')}
                >
                  <Ionicons name="logo-twitter" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.socialLink}
                  onPress={() => openLink('https://instagram.com/umuhinzihub')}
                >
                  <Ionicons name="logo-instagram" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.socialLink}
                  onPress={() => openLink('https://linkedin.com/company/umuhinzihub')}
                >
                  <Ionicons name="logo-linkedin" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.footerLinks}>
                <TouchableOpacity onPress={() => router.push('/privacy')}>
                  <Text style={styles.footerLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/terms')}>
                  <Text style={styles.footerLink}>Terms of Service</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/support')}>
                  <Text style={styles.footerLink}>Support</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.copyright}>
                © 2024 UmuhinziHub. All rights reserved.{"\n"}
                Made with ❤️ for African Farmers
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Theme-aware StyleSheet function ---
const createStyles = (colors: ThemeColors, screenWidth: number) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingOrb: {
    position: "absolute",
    borderRadius: 999,
  },
  orb1: {
    top: "10%",
    right: "-10%",
    width: 200,
    height: 200,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  orb2: {
    top: "40%",
    left: "-10%",
    width: 250,
    height: 250,
    backgroundColor: colors.info,
    opacity: 0.08,
  },
  orb3: {
    bottom: "20%",
    right: "20%",
    width: 150,
    height: 150,
    backgroundColor: colors.warning,
    opacity: 0.06,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 6,
    backgroundColor: `${colors.primary}1A`, // 10% opacity
    borderRadius: 8,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  shareButton: {
    padding: 6,
    backgroundColor: `${colors.primary}1A`, // 10% opacity
    borderRadius: 8,
  },
  heroSection: {
    padding: 20,
    paddingTop: 30,
  },
  heroContent: {
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.primary}1A`, // 10% opacity
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${colors.primary}4D`, // 30% opacity
    marginBottom: 20,
  },
  heroBadgeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 12,
  },
  heroTitleHighlight: {
    color: colors.primary,
  },
  heroDescription: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  heroStats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
  },
  heroStat: {
    alignItems: "center",
  },
  heroStatNumber: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  heroStatLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  section: {
    padding: 20,
    marginTop: 10,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  purposeGrid: {
    gap: 16,
  },
  purposeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  purposeIcon: {
    backgroundColor: `${colors.primary}1A`, // 10% opacity
    padding: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  purposeTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  purposeDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  valuesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  valueItem: {
    width: (screenWidth - 52) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  valueIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  valueTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  valueDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  featureCard: {
    width: (screenWidth - 52) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    backgroundColor: `${colors.primary}1A`, // 10% opacity
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  featureDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
  },
  impactStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  impactStat: {
    width: (screenWidth - 52) / 2,
    backgroundColor: `${colors.primary}0D`, // 5% opacity
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${colors.primary}1A`, // 10% opacity
  },
  impactNumber: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  impactLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },
  teamScroll: {
    marginHorizontal: -20,
  },
  teamScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  teamCard: {
    width: 140,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  teamAvatar: {
    fontSize: 32,
    marginBottom: 8,
  },
  teamName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  teamRole: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  teamDescription: {
    color: colors.textSecondary,
    fontSize: 10,
    textAlign: "center",
  },
  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  techItem: {
    width: (screenWidth - 52) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  techIcon: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  techTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  techDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
  },
  ctaCard: {
    backgroundColor: `${colors.primary}1A`, // 10% opacity
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: `${colors.primary}33`, // 20% opacity
  },
  ctaContent: {
    alignItems: "center",
  },
  ctaTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  ctaDescription: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  ctaButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  primaryButton: {
    flex: 2,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: colors.background, // Dark text on light button
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: `${colors.primary}4D`, // 30% opacity
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  contactItem: {
    width: (screenWidth - 52) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  contactTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  contactValue: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 30,
    paddingTop: 30,
  },
  footerContent: {
    padding: 20,
    alignItems: "center",
  },
  footerLogo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logoIcon: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  logoText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  footerTagline: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  socialLinks: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  socialLink: {
    backgroundColor: `${colors.primary}1A`, // 10% opacity
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${colors.primary}33`, // 20% opacity
  },
  footerLinks: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  copyright: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});