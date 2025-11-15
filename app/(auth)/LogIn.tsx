import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../contexts/AuthContext"; // added import

interface LogInFormData {
  emailOrPhone: string;
  password: string;
}

export default function LogIn() {
  const router = useRouter();
  const { signIn } = useAuth(); // optional, if your AuthContext exposes a signIn/login method
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<LogInFormData>({
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onSubmit = async (data: LogInFormData) => {
    setLoading(true);
    try {
      const response = await fetch("https://umuhinzihub-be-3.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.emailOrPhone,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // store auth state if AuthContext provides signIn (await so context updates before navigation)
        if (typeof signIn === "function") {
          try {
            signIn(responseData);
          } catch (e) {
            console.warn("AuthContext.signIn failed:", e);
            // still attempt navigation if signIn fails to avoid blocking the user
          }
        }

        // navigate to tabs home and prevent back to auth
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Error", responseData.message || "Login failed");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoGlow}>
          <Ionicons name="leaf" size={40} color="#00FF88" />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Log in to continue growing with UmuhinziHub
        </Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Phone Number or Email</Text>
        <Controller
          control={control}
          name="emailOrPhone"
          rules={{ required: "Phone number or email is required" }}
          render={({ field: { onChange, value } }) => (
            <View style={[styles.inputContainer, errors.emailOrPhone && styles.inputContainerError]}>
              <Ionicons name="person-outline" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="Enter phone or email"
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
              />
            </View>
          )}
        />
        {errors.emailOrPhone && (
          <Text style={styles.errorText}>{errors.emailOrPhone.message}</Text>
        )}

        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View style={[styles.inputContainer, errors.password && styles.inputContainerError]}>
              <Ionicons name="lock-closed-outline" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            </View>
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <TouchableOpacity>
          <Link href="/ForgotPassword" style={styles.forgot}>Forgot Password?</Link>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0E1410" size="small" />
          ) : (
            <>
              <Ionicons name="log-in-outline" size={18} color="#0E1410" />
              <Text style={styles.buttonText}>Log In</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Link href="/SignUp" style={styles.signUpLink}>
            Sign Up
          </Link>
        </Text>
      </View>

      {/* Footer Card */}
      <View style={styles.footerCard}>
        <Ionicons name="leaf-outline" size={28} color="#00FF88" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.footerTitle}>Digital Farming Solutions</Text>
          <Text style={styles.footerSub}>
            Empowering farmers with technology
          </Text>
        </View>
      </View>

      <Text style={styles.poweredText}>
        Powered by <Text style={{ color: "#00FF88" }}>UmuhinziHub</Text> — Digital Solutions for Farmers
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0E1410",
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoGlow: {
    backgroundColor: "rgba(0,255,136,0.1)",
    padding: 20,
    borderRadius: 50,
    marginBottom: 15,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: "rgba(20,30,20,0.8)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#00FF88",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E261E",
    borderColor: "#00FF88",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  inputContainerError: {
    borderColor: "#FF4444",
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 10,
    marginLeft: 8,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 3,
  },
  forgot: {
    color: "#00FF88",
    textAlign: "right",
    marginTop: 10,
    fontSize: 13,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00FF88",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#0E1410",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  footerText: {
    textAlign: "center",
    color: "#ccc",
    marginTop: 15,
  },
  signUpLink: {
    color: "#00FF88",
    fontWeight: "600",
  },
  footerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20,30,20,0.9)",
    borderRadius: 16,
    padding: 15,
    marginTop: 30,
  },
  footerTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  footerSub: {
    color: "#aaa",
    fontSize: 12,
  },
  poweredText: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    marginTop: 15,
  },
});
