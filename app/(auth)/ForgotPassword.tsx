import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getThemeColors } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

export default function ForgotPassword() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: input, 2: code verification, 3: new password
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  const { currentTheme, toggleTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const styles = createStyles(colors);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSendCode = async () => {
    if (!emailOrPhone) {
      Alert.alert("Error", "Please enter your email or phone number");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      Alert.alert("Code Sent", "We've sent a 6-digit verification code to your registered contact.");
    }, 2000);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please enter and confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Success!", 
        "Your password has been reset successfully!",
        [
          {
            text: "Log In",
            // This is correct. Send them back to LogIn.
            onPress: () => router.replace("/(auth)/LogIn")
          }
        ]
      );
    }, 2000);
  };

  const resetMethods = [
    {
      icon: "mail",
      title: "Email Reset",
      description: "Get a reset link via email",
      active: true
    },
  ];

  const renderStep1 = () => (
    <>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Reset Your Password</Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        Enter your registered email or phone number to receive a verification code
      </Text>

      <Text style={[styles.label, { color: colors.textSecondary }]}>Email or Phone Number *</Text>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Enter your email or phone number"
          placeholderTextColor={colors.textSecondary}
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Reset Methods */}
      <View style={styles.methodsSection}>
        <Text style={[styles.methodsTitle, { color: colors.text }]}>Reset Methods</Text>
        <View style={styles.methodsGrid}>
          {resetMethods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.methodButton,
                { backgroundColor: `${colors.primary}10`, borderColor: colors.border },
                !method.active && styles.methodButtonDisabled
              ]}
              disabled={!method.active}
            >
              <View style={styles.methodIcon}>
                <Ionicons 
                  name={method.icon as any} 
                  size={20} 
                  color={method.active ? colors.primary : colors.textSecondary} 
                />
              </View>
              <Text style={[
                styles.methodTitle,
                { color: method.active ? colors.primary : colors.textSecondary },
                !method.active && styles.methodTitleDisabled
              ]}>
                {method.title}
              </Text>
              <Text style={[styles.methodDescription, { color: colors.textSecondary }]}>{method.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }, isLoading && styles.buttonDisabled]}
        onPress={handleSendCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="reload" size={20} color={colors.background} />
            <Text style={[styles.buttonText, { color: colors.background }]}>Sending Code...</Text>
          </View>
        ) : (
          <>
            <Ionicons name="send-outline" size={20} color={colors.background} />
            <Text style={[styles.buttonText, { color: colors.background }]}>Send Verification Code</Text>
          </>
        )}
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Enter Verification Code</Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        We sent a 6-digit code to {emailOrPhone}
      </Text>

      <Text style={[styles.label, { color: colors.textSecondary }]}>Verification Code *</Text>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="key-outline" size={20} color={colors.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Enter 6-digit code"
          placeholderTextColor={colors.textSecondary}
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>

      <View style={styles.resendContainer}>
        <Text style={[styles.resendText, { color: colors.textSecondary }]}>Did not receive the code?</Text>
        <TouchableOpacity>
          <Text style={[styles.resendLink, { color: colors.primary }]}>Resend Code</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }, isLoading && styles.buttonDisabled]}
        onPress={handleVerifyCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="reload" size={20} color={colors.background} />
            <Text style={[styles.buttonText, { color: colors.background }]}>Verifying...</Text>
          </View>
        ) : (
          <>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.background} />
            <Text style={[styles.buttonText, { color: colors.background }]}>Verify Code</Text>
          </>
        )}
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Create New Password</Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        Enter your new password and confirm it
      </Text>

      <Text style={[styles.label, { color: colors.textSecondary }]}>New Password *</Text>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Enter new password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
          <Ionicons 
            name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
            size={20} 
            color={colors.primary} 
            style={styles.eyeIcon} 
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm New Password *</Text>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Confirm new password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons 
            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
            size={20} 
            color={colors.primary} 
            style={styles.eyeIcon} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordRequirements}>
        <Text style={[styles.requirementsTitle, { color: colors.text }]}>Password Requirements:</Text>
        <View style={styles.requirementItem}>
          <Ionicons 
            name={newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
            size={14} 
            color={newPassword.length >= 6 ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.requirementText, { color: colors.textSecondary }]}>At least 6 characters</Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons 
            name={newPassword === confirmPassword && newPassword.length > 0 ? "checkmark-circle" : "ellipse-outline"} 
            size={14} 
            color={newPassword === confirmPassword && newPassword.length > 0 ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.requirementText, { color: colors.textSecondary }]}>Passwords match</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }, isLoading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="reload" size={20} color={colors.background} />
            <Text style={[styles.buttonText, { color: colors.background }]}>Resetting...</Text>
          </View>
        ) : (
          <>
            <Ionicons name="refresh-outline" size={20} color={colors.background} />
            <Text style={[styles.buttonText, { color: colors.background }]}>Reset Password</Text>
          </>
        )}
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Animated Background */}
      <View style={styles.backgroundOverlay}>
        <Animated.View style={[styles.floatingOrb, styles.orb1, { backgroundColor: colors.primary }]} />
        <Animated.View style={[styles.floatingOrb, styles.orb2, { backgroundColor: colors.info }]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.backButton, { backgroundColor: `${colors.primary}20` }]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color={colors.primary} />
            </TouchableOpacity>

            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <View style={[styles.logoGlow, { backgroundColor: colors.primary }]} />
                <Ionicons name="key" size={44} color={colors.primary} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Secure your UmuhinziHub farmer account
              </Text>
            </View>
          </View>

          {/* Progress Steps */}
          <View style={styles.progressSection}>
            <View style={styles.progressSteps}>
              {[1, 2, 3].map((stepNumber) => (
                <View key={stepNumber} style={styles.stepContainer}>
                  <View style={[
                    styles.stepCircle,
                    { borderColor: colors.primary },
                    step >= stepNumber ? [styles.stepCircleActive, { backgroundColor: colors.primary }] : [styles.stepCircleInactive, { backgroundColor: `${colors.primary}10` }]
                  ]}>
                    <Text style={[
                      styles.stepNumber,
                      step >= stepNumber ? [styles.stepNumberActive, { color: colors.background }] : [styles.stepNumberInactive, { color: colors.primary }]
                    ]}>
                      {stepNumber}
                    </Text>
                  </View>
                  {stepNumber < 3 && (
                    <View style={[
                      styles.stepLine,
                      step > stepNumber ? [styles.stepLineActive, { backgroundColor: colors.primary }] : [styles.stepLineInactive, { backgroundColor: `${colors.primary}20` }]
                    ]} />
                  )}
                </View>
              ))}
            </View>
            <View style={styles.stepLabels}>
              <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>Identify</Text>
              <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>Verify</Text>
              <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>Reset</Text>
            </View>
          </View>

          {/* Form Container */}
          <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Back to Login */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Remember your password?{" "}
                <Link href="/(auth)/LogIn" style={styles.loginLink}>
                  <Text style={[styles.loginLinkText, { color: colors.primary }]}>Back to Login</Text>
                </Link>
              </Text>
            </View>
          </View>

          {/* Security Assurance */}
          <View style={[styles.securityCard, { backgroundColor: `${colors.primary}10`, borderColor: colors.border }]}>
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              <Text style={[styles.securityTitle, { color: colors.primary }]}>Security Assurance</Text>
            </View>
            <Text style={[styles.securityDescription, { color: colors.textSecondary }]}>
              Your account security is our priority. All password reset requests are encrypted and verified for your protection.
            </Text>
          </View>

          {/* Support Note */}
          <View style={styles.supportNote}>
            <Ionicons name="help-circle" size={16} color={colors.primary} />
            <Text style={[styles.supportText, { color: colors.textSecondary }]}>
              Need help? Contact support: support@umuhinzihub.rw
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Your createStyles function
const createStyles = (colors: any) => StyleSheet.create({
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
    opacity: 0.1,
  },
  orb1: {
    top: "5%",
    right: "-10%",
    width: 120,
    height: 120,
  },
  orb2: {
    bottom: "10%",
    left: "-10%",
    width: 180,
    height: 180,
    opacity: 0.08,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 10,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  themeToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
    position: "absolute",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  stepCircleActive: {
    borderWidth: 2,
  },
  stepCircleInactive: {
    borderWidth: 2,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  stepNumberActive: {
    
  },
  stepNumberInactive: {
    
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 4,
  },
  stepLineActive: {
    
  },
  stepLineInactive: {
    
  },
  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "500",
    width: 90,
    textAlign: "center",
  },
  form: {
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  methodsSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  methodsGrid: {
    gap: 12,
  },
  methodButton: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  methodButtonDisabled: {
    opacity: 0.5,
  },
  methodIcon: {
    marginBottom: 8,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  methodTitleDisabled: {
    
  },
  methodDescription: {
    fontSize: 12,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 6,
  },
  resendText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  passwordRequirements: {
    marginTop: 16,
    marginBottom: 10,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    
  },
  loginLinkText: {
    fontWeight: "bold",
  },
  securityCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
  },
  securityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  securityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  supportNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
  },
  supportText: {
    fontSize: 12,
  },
});