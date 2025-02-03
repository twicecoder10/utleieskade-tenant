import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [loaded, font_error] = useFonts({
    DMSans: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setIsLayoutReady(true);
    }
    if (font_error) {
      console.log("There was an error in loading fonts");
    }
  }, [loaded]);

  useEffect(() => {
    if (isLayoutReady) {
      if (!isAuthenticated) {
        router.replace("/auth");
      }
    }
  }, [isAuthenticated, isLayoutReady]);
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Check authentication status */}
        {!isAuthenticated ? (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
            <Stack.Screen
              name="auth/forgot-password"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="auth/verify" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        ) : (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="settings/change-password"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="settings/privacy-policy"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="reports/all-cases"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="reports/report-damage"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="reports/report-details"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="reports/saved-drafts"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        )}
      </Stack>

      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}

