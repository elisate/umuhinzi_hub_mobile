import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SignUpFormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const response = await fetch("https://umuhinzihub-be-3.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.fullName,
          phone: data.phone,
          email: data.email || undefined,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!");
        // Navigate to home or dashboard instead
        router.push("/(auth)/LogIn"); // or your desired route
      } else {
        Alert.alert("Error", responseData.message || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoGlow} />
          <Ionicons name="leaf" size={40} color="#00FF88" />
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Join UmuhinziHub and start your digital farming journey
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <Controller
            control={control}
            name="fullName"
            rules={{ required: "Full name is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Enter your full name"
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName.message}</Text>
          )}

          <Text style={styles.label}>Phone Number</Text>
          <Controller
            control={control}
            name="phone"
            rules={{ required: "Phone number is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="+250 XXX XXX XXX"
                keyboardType="phone-pad"
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone.message}</Text>
          )}

          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
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
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Create a strong password"
                secureTextEntry
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          <Text style={styles.label}>Confirm Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm your password"
                secureTextEntry
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0E1410" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Link to Login */}
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Link href="/LogIn" style={styles.loginLink}>
              Log In
            </Link>
          </Text>
        </View>

        <Text style={styles.footerNote}>
          Empowering farmers through innovation
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0E1410",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoGlow: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00FF88",
    opacity: 0.2,
    position: "absolute",
    top: 0,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 70,
  },
  subtitle: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
  },
  form: {
    backgroundColor: "rgba(20, 30, 20, 0.7)",
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
  input: {
    backgroundColor: "#1E261E",
    borderColor: "#00FF88",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    marginTop: 5,
  },
  inputError: {
    borderColor: "#FF4444",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 3,
  },
  button: {
    backgroundColor: "#00FF88",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "#0E1410",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerText: {
    textAlign: "center",
    color: "#ccc",
    marginTop: 15,
  },
  loginLink: {
    color: "#00FF88",
    fontWeight: "600",
  },
  footerNote: {
    textAlign: "center",
    color: "#555",
    fontSize: 12,
    marginTop: 30,
  },
});
