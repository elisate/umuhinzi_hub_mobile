import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors, ThemeColors } from "../constants/theme";

const { width: screenWidth } = Dimensions.get("window");

// Weather API Configuration
const WEATHER_API_KEY = "demo"; // Replace with your OpenWeatherMap API key
const DEFAULT_CITY = "Musanze";
const DEFAULT_COUNTRY = "RW";

interface HourlyForecast {
  id: string;
  time: string;
  code: number;
  temp: number;
  timestamp: number;
}

interface DailyForecast {
  id: string;
  day: string;
  code: number;
  high: number;
  low: number;
  rain: number;
}

interface WeatherDetails {
  wind: number;
  humidity: number;
  pressure: number;
  visibility: number;
  clouds: number;
  sunrise: number;
  sunset: number;
}

interface FarmingAdvice {
  title: string;
  description: string;
  icon: "warning" | "rain" | "check";
  color: string;
}

interface CurrentWeather {
  location: string;
  temp: number;
  condition: string;
  description: string;
  code: number;
  feelsLike: number;
  high: number;
  low: number;
}

interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  details: WeatherDetails;
  advice: FarmingAdvice;
}

export default function WeatherScreen() {
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme);
  const { bottom: bottomInset } = useSafeAreaInsets();
  const styles = createStyles(colors, bottomInset);

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [location] = useState({ city: DEFAULT_CITY, country: DEFAULT_COUNTRY });
  const [useDemo, setUseDemo] = useState(false);

  // Demo data fallback
  const getDemoData = useCallback((): WeatherData => {
    const now = new Date();
    return {
      current: {
        location: "Musanze, Rwanda",
        temp: 24,
        condition: "Partly Cloudy",
        description: "partly cloudy",
        code: 802,
        feelsLike: 25,
        high: 26,
        low: 15,
      },
      hourly: Array.from({ length: 8 }, (_, i) => ({
        id: i.toString(),
        time:
          i === 0
            ? "Now"
            : new Date(now.getTime() + i * 3600000).toLocaleTimeString("en-US", {
                hour: "numeric",
              }),
        code: [800, 801, 802, 803][Math.floor(Math.random() * 4)],
        temp: Math.round(24 + Math.random() * 4 - 2),
        timestamp: Math.floor((now.getTime() + i * 3600000) / 1000),
      })),
      daily: Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() + i * 86400000);
        return {
          id: i.toString(),
          day:
            i === 0
              ? "Today"
              : date.toLocaleDateString("en-US", { weekday: "short" }),
          code: [800, 801, 500, 802, 803][Math.floor(Math.random() * 5)],
          high: Math.round(26 + Math.random() * 4),
          low: Math.round(15 + Math.random() * 3),
          rain: Math.round(Math.random() * 60),
        };
      }),
      details: {
        wind: 12,
        humidity: 65,
        pressure: 1013,
        visibility: 10,
        clouds: 40,
        sunrise: Math.floor(new Date().setHours(6, 5, 0) / 1000),
        sunset: Math.floor(new Date().setHours(18, 10, 0) / 1000),
      },
      advice: {
        title: "Good Conditions for Farming",
        description:
          "Current weather conditions are favorable for most farming activities including spraying and irrigation.",
        icon: "check",
        color: colors.success,
      },
    };
  }, [colors.success]);

  // Process daily forecast from 3-hour intervals
  const processDailyForecast = useCallback((list: any[]): DailyForecast[] => {
    const dailyMap = new Map();

    list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toLocaleDateString();

      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          date: date,
          temps: [],
          conditions: [],
          rain: 0,
          code: item.weather[0].id,
        });
      }

      const day = dailyMap.get(dayKey);
      day.temps.push(item.main.temp);
      day.conditions.push(item.weather[0].id);
      if (item.rain && item.rain["3h"]) day.rain += item.rain["3h"];
    });

    const days = Array.from(dailyMap.values()).slice(0, 7);

    return days.map((day: any, index) => ({
      id: index.toString(),
      day:
        index === 0
          ? "Today"
          : day.date.toLocaleDateString("en-US", { weekday: "short" }),
      code: Math.max(...day.conditions),
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      rain: Math.min(Math.round(day.rain * 10), 100),
    }));
  }, []);

  // Generate farming advice based on weather conditions
  const generateFarmingAdvice = useCallback(
    (current: any, upcoming: any[]): FarmingAdvice => {
      const windSpeed = current.wind.speed * 3.6;
      const hasRain = upcoming.some((item) =>
        item.weather[0].main.includes("Rain")
      );
      const avgTemp =
        upcoming.reduce((sum, item) => sum + item.main.temp, 0) /
        upcoming.length;

      if (windSpeed > 20) {
        return {
          title: "High Wind Warning",
          description: `Wind speeds of ${Math.round(
            windSpeed
          )} km/h may affect spraying operations. Consider postponing until conditions improve.`,
          icon: "warning",
          color: colors.warning,
        };
      } else if (hasRain) {
        return {
          title: "Rain Expected",
          description:
            "Rain is forecasted in the next few hours. Avoid spraying operations and consider irrigation scheduling.",
          icon: "rain",
          color: colors.info,
        };
      } else if (avgTemp > 30) {
        return {
          title: "High Temperature Alert",
          description:
            "High temperatures may increase water evaporation. Consider increasing irrigation frequency.",
          icon: "warning",
          color: colors.error,
        };
      } else {
        return {
          title: "Good Conditions for Farming",
          description:
            "Current weather conditions are favorable for most farming activities including spraying and irrigation.",
          icon: "check",
          color: colors.success,
        };
      }
    },
    [colors.warning, colors.info, colors.error, colors.success]
  );

  // Fetch weather data
  const fetchWeatherData = useCallback(
    async (showRefreshIndicator = false) => {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      // Check if using demo mode
      if (WEATHER_API_KEY === "demo" || useDemo) {
        setTimeout(() => {
          setWeatherData(getDemoData());
          setLoading(false);
          setRefreshing(false);
          setUseDemo(true);
        }, 800);
        return;
      }

      try {
        // Fetch current weather and forecast
        const [currentResponse, forecastResponse] = await Promise.all([
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location.city},${location.country}&units=metric&appid=${WEATHER_API_KEY}`
          ),
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${location.city},${location.country}&units=metric&appid=${WEATHER_API_KEY}`
          ),
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
          throw new Error("Failed to fetch weather data. Please check your API key.");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        // Process and structure the data
        const processed: WeatherData = {
          current: {
            location: `${currentData.name}, ${currentData.sys.country}`,
            temp: Math.round(currentData.main.temp),
            condition: currentData.weather[0].main,
            description: currentData.weather[0].description,
            code: currentData.weather[0].id,
            feelsLike: Math.round(currentData.main.feels_like),
            high: Math.round(currentData.main.temp_max),
            low: Math.round(currentData.main.temp_min),
          },
          hourly: forecastData.list.slice(0, 8).map((item: any, index: number) => ({
            id: index.toString(),
            time:
              index === 0
                ? "Now"
                : new Date(item.dt * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                  }),
            code: item.weather[0].id,
            temp: Math.round(item.main.temp),
            timestamp: item.dt,
          })),
          daily: processDailyForecast(forecastData.list),
          details: {
            wind: Math.round(currentData.wind.speed * 3.6),
            humidity: currentData.main.humidity,
            pressure: currentData.main.pressure,
            visibility: Math.round(currentData.visibility / 1000),
            clouds: currentData.clouds.all,
            sunrise: currentData.sys.sunrise,
            sunset: currentData.sys.sunset,
          },
          advice: generateFarmingAdvice(
            currentData,
            forecastData.list.slice(0, 4)
          ),
        };

        setWeatherData(processed);
      } catch (err: any) {
        setError(err.message);
        // Fallback to demo data on error
        setWeatherData(getDemoData());
        setUseDemo(true);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [location, useDemo, processDailyForecast, generateFarmingAdvice, getDemoData]
  );

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Get weather icon based on code
  const getWeatherIcon = (code: number, size = 24) => {
    if (code >= 200 && code < 300)
      return (
        <MaterialCommunityIcons
          name="weather-lightning-rainy"
          size={size}
          color={colors.info}
        />
      );
    if (code >= 300 && code < 400)
      return (
        <MaterialCommunityIcons
          name="weather-partly-rainy"
          size={size}
          color={colors.info}
        />
      );
    if (code >= 500 && code < 600)
      return (
        <MaterialCommunityIcons
          name="weather-rainy"
          size={size}
          color={colors.info}
        />
      );
    if (code >= 600 && code < 700)
      return (
        <MaterialCommunityIcons
          name="weather-snowy"
          size={size}
          color={colors.info}
        />
      );
    if (code >= 700 && code < 800)
      return (
        <MaterialCommunityIcons
          name="weather-fog"
          size={size}
          color={colors.textSecondary}
        />
      );
    if (code === 800)
      return (
        <MaterialCommunityIcons
          name="weather-sunny"
          size={size}
          color={colors.warning}
        />
      );
    if (code === 801)
      return (
        <MaterialCommunityIcons
          name="weather-partly-cloudy"
          size={size}
          color={colors.warning}
        />
      );
    if (code > 801)
      return (
        <MaterialCommunityIcons
          name="weather-cloudy"
          size={size}
          color={colors.textSecondary}
        />
      );

    return (
      <MaterialCommunityIcons
        name="weather-sunny"
        size={size}
        color={colors.warning}
      />
    );
  };

  const handleRefresh = () => {
    fetchWeatherData(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!weatherData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={styles.errorTitle}>Unable to Load Weather</Text>
          <Text style={styles.errorText}>Please try again later</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchWeatherData()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Weather Forecast</Text>
            {/* Demo Mode - Add API key for live data */}
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <Ionicons
            name="refresh"
            size={22}
            color={colors.primary}
            style={refreshing && styles.rotating}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Current Weather Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroLocation}>{weatherData.current.location}</Text>
              <Text style={styles.heroDescription}>
                {weatherData.current.description}
              </Text>
            </View>
            <View style={styles.heroIconContainer}>
              {getWeatherIcon(weatherData.current.code, 64)}
            </View>
          </View>

          <View style={styles.heroTemp}>
            <Text style={styles.heroTempNumber}>{weatherData.current.temp}</Text>
            <Text style={styles.heroTempUnit}>°C</Text>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <Ionicons name="arrow-up" size={16} color={colors.white} />
              <Text style={styles.heroStatText}>{weatherData.current.high}°</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Ionicons name="arrow-down" size={16} color={colors.white} />
              <Text style={styles.heroStatText}>{weatherData.current.low}°</Text>
            </View>
            <View style={styles.heroStatItem}>
              <MaterialCommunityIcons
                name="thermometer"
                size={16}
                color={colors.white}
              />
              <Text style={styles.heroStatText}>
                Feels like {weatherData.current.feelsLike}°
              </Text>
            </View>
          </View>
        </View>

        {/* Hourly Forecast */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourlyScroll}
          >
            {weatherData.hourly.map((hour) => (
              <View
                key={hour.id}
                style={[
                  styles.hourlyItem,
                  hour.time === "Now" && styles.hourlyItemNow,
                ]}
              >
                <Text
                  style={[
                    styles.hourlyTime,
                    hour.time === "Now" && styles.hourlyTimeNow,
                  ]}
                >
                  {hour.time}
                </Text>
                <View style={styles.hourlyIcon}>
                  {getWeatherIcon(hour.code, 32)}
                </View>
                <Text
                  style={[
                    styles.hourlyTemp,
                    hour.time === "Now" && styles.hourlyTempNow,
                  ]}
                >
                  {hour.temp}°
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 7-Day Forecast */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          <View style={styles.dailyContainer}>
            {weatherData.daily.map((day, index) => (
              <View
                key={day.id}
                style={[
                  styles.dailyItem,
                  index !== weatherData.daily.length - 1 && styles.dailyItemBorder,
                ]}
              >
                <Text style={styles.dailyDay}>{day.day}</Text>
                <View style={styles.dailyCenter}>
                  <View style={styles.dailyIconContainer}>
                    {getWeatherIcon(day.code, 24)}
                  </View>
                  <View style={styles.dailyRain}>
                    <Ionicons name="water" size={14} color={colors.info} />
                    <Text style={styles.dailyRainText}>{day.rain}%</Text>
                  </View>
                </View>
                <View style={styles.dailyTemps}>
                  <Text style={styles.dailyHigh}>{day.high}°</Text>
                  <View style={styles.dailyTempBar} />
                  <Text style={styles.dailyLow}>{day.low}°</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomGrid}>
          {/* Weather Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <View style={[styles.detailIcon, { backgroundColor: `${colors.info}20` }]}>
                  <Ionicons name="speedometer" size={20} color={colors.info} />
                </View>
                <Text style={styles.detailLabel}>Wind Speed</Text>
                <Text style={styles.detailValue}>
                  {weatherData.details.wind}{" "}
                  <Text style={styles.detailUnit}>km/h</Text>
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View style={[styles.detailIcon, { backgroundColor: `${colors.info}20` }]}>
                  <Ionicons name="water" size={20} color={colors.info} />
                </View>
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>
                  {weatherData.details.humidity}
                  <Text style={styles.detailUnit}>%</Text>
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View
                  style={[styles.detailIcon, { backgroundColor: `${colors.primary}20` }]}
                >
                  <MaterialCommunityIcons
                    name="gauge"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.detailLabel}>Pressure</Text>
                <Text style={styles.detailValue}>
                  {weatherData.details.pressure}{" "}
                  <Text style={styles.detailUnit}>hPa</Text>
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View
                  style={[styles.detailIcon, { backgroundColor: `${colors.primary}20` }]}
                >
                  <Ionicons name="eye" size={20} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>Visibility</Text>
                <Text style={styles.detailValue}>
                  {weatherData.details.visibility}{" "}
                  <Text style={styles.detailUnit}>km</Text>
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View
                  style={[styles.detailIcon, { backgroundColor: `${colors.warning}20` }]}
                >
                  <Ionicons name="sunny" size={20} color={colors.warning} />
                </View>
                <Text style={styles.detailLabel}>Sunrise</Text>
                <Text style={styles.detailValue}>
                  {new Date(weatherData.details.sunrise * 1000).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View
                  style={[styles.detailIcon, { backgroundColor: `${colors.warning}20` }]}
                >
                  <Ionicons name="moon" size={20} color={colors.warning} />
                </View>
                <Text style={styles.detailLabel}>Sunset</Text>
                <Text style={styles.detailValue}>
                  {new Date(weatherData.details.sunset * 1000).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Farming Advice */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farming Advice</Text>
            <View
              style={[
                styles.adviceCard,
                { borderLeftColor: weatherData.advice.color },
              ]}
            >
              <View
                style={[
                  styles.adviceIcon,
                  { backgroundColor: `${weatherData.advice.color}20` },
                ]}
              >
                {weatherData.advice.icon === "warning" && (
                  <Ionicons
                    name="warning"
                    size={28}
                    color={weatherData.advice.color}
                  />
                )}
                {weatherData.advice.icon === "rain" && (
                  <Ionicons name="rainy" size={28} color={weatherData.advice.color} />
                )}
                {weatherData.advice.icon === "check" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={28}
                    color={weatherData.advice.color}
                  />
                )}
              </View>
              <View style={styles.adviceContent}>
                <Text
                  style={[
                    styles.adviceTitle,
                    { color: weatherData.advice.color },
                  ]}
                >
                  {weatherData.advice.title}
                </Text>
                <Text style={styles.adviceDescription}>
                  {weatherData.advice.description}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last updated: {new Date().toLocaleString()}
          </Text>
              {/* Currently using demo data. Add your OpenWeatherMap API key to get live
              weather updates. */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Dynamic Stylesheet
const createStyles = (colors: ThemeColors, bottomInset: number) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 6,
      backgroundColor: `${colors.primary}1A`,
      borderRadius: 8,
    },
    headerCenter: {
      flex: 1,
      marginLeft: 12,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
    },
    demoModeText: {
      color: colors.warning,
      fontSize: 11,
      marginTop: 2,
    },
    refreshButton: {
      padding: 6,
      backgroundColor: `${colors.primary}1A`,
      borderRadius: 8,
    },
    rotating: {
      // Animation would be handled by Animated API if needed
    },
    scrollContent: {
      paddingBottom: 20 + bottomInset,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: 16,
      marginTop: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 16,
    },
    errorText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 8,
      marginBottom: 24,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    retryButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    heroCard: {
      backgroundColor: colors.primary,
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 20,
      borderRadius: 20,
      padding: 24,
      overflow: "hidden",
    },
    heroHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    heroLocation: {
      color: colors.white,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 4,
    },
    heroDescription: {
      color: colors.white,
      fontSize: 14,
      opacity: 0.9,
      textTransform: "capitalize",
    },
    heroIconContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: 12,
      borderRadius: 16,
    },
    heroTemp: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    heroTempNumber: {
      color: colors.white,
      fontSize: 72,
      fontWeight: "300",
      lineHeight: 72,
    },
    heroTempUnit: {
      color: colors.white,
      fontSize: 28,
      fontWeight: "300",
      marginTop: 8,
    },
    heroStats: {
      flexDirection: "row",
      gap: 16,
    },
    heroStatItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      gap: 6,
    },
    heroStatText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: "600",
    },
    section: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
    },
    hourlyScroll: {
      paddingRight: 20,
      gap: 12,
    },
    hourlyItem: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      minWidth: 80,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    hourlyItemNow: {
      backgroundColor: `${colors.primary}1A`,
      borderColor: colors.primary,
      borderWidth: 2,
    },
    hourlyTime: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 12,
    },
    hourlyTimeNow: {
      color: colors.primary,
    },
    hourlyIcon: {
      marginBottom: 12,
    },
    hourlyTemp: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    hourlyTempNow: {
      color: colors.primary,
    },
    dailyContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    dailyItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    dailyItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dailyDay: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "bold",
      width: 80,
    },
    dailyCenter: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 12,
    },
    dailyIconContainer: {
      backgroundColor: colors.gray100,
      padding: 8,
      borderRadius: 10,
    },
    dailyRain: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.info}1A`,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 4,
    },
    dailyRainText: {
      color: colors.info,
      fontSize: 12,
      fontWeight: "600",
    },
    dailyTemps: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    dailyHigh: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
      width: 35,
      textAlign: "right",
    },
    dailyTempBar: {
      width: 80,
      height: 4,
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    dailyLow: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: "600",
      width: 35,
    },
    bottomGrid: {
      gap: 20,
    },
    detailsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    detailCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      width: (screenWidth - 64) / 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    detailIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    detailLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 8,
    },
    detailValue: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
    },
    detailUnit: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "normal",
    },
    adviceCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      borderLeftWidth: 4,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 16,
    },
    adviceIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    adviceContent: {
      flex: 1,
    },
    adviceTitle: {
      fontSize: 17,
      fontWeight: "bold",
      marginBottom: 6,
    },
    adviceDescription: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    footer: {
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    footerText: {
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: "center",
    },
    footerDemo: {
      color: colors.warning,
      fontSize: 12,
      textAlign: "center",
      marginTop: 8,
      fontWeight: "500",
    },
  });