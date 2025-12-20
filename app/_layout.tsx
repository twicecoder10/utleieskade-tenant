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
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkAuthAsync } from "@/slice/userSlice";
import { Platform } from "react-native";

// Stripe only works on native platforms, not web
let StripeProvider: any = ({ children }: { children: React.ReactNode }) => <>{children}</>;
if (Platform.OS !== "web") {
  try {
    const stripe = require("@stripe/stripe-react-native");
    StripeProvider = stripe.StripeProvider;
  } catch (e) {
    console.warn("Stripe not available on this platform");
  }
}

const STRIPE_PUBLISHABLE_KEY = "pk_test_51S8GeZ7JTnPFD5f8GW16A2EGd6kbnfmJpBRtH9jj0myVq3vzoK0Wp7mCgbSOETBohD6YJXjUSLwjVdmWB3OlYgPq00GSl1t760";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [loaded, font_error] = useFonts({
    DMSans: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.user);

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
      dispatch(checkAuthAsync());
    }
  }, [isLayoutReady]);

  useEffect(() => {
    if (isLayoutReady) {
      if (!isLoggedIn) {
        router.replace("/auth");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isLoggedIn, isLayoutReady]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
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
            <Stack.Screen
              name="reports/report-preview"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="reports/assessment-payment"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="reports/receipts"
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

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <RootLayoutContent />
      </StripeProvider>
    </Provider>
  );
}
