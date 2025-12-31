import { HabitsProvider } from "@/hooks/useHabits";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log(auth);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged ", user);
      setUser(user);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    console.log(
      "Navigation effect - user:",
      user?.email || "null",
      "inAuthGroup:",
      inAuthGroup,
      "segments:",
      segments
    );

    if (user && !inAuthGroup) {
      console.log("Redirecting to /(auth)");
      router.replace("/(auth)/home");
    } else if (!user && inAuthGroup) {
      console.log("Redirecting to /");
      router.replace("/");
    }
  }, [user, initializing, router, segments]);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <HabitsProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </HabitsProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
