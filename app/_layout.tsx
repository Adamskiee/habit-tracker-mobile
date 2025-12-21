import { HabitsProvider } from "@/hooks/useHabits";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <HabitsProvider>
          <Stack>
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
          </Stack>
        </HabitsProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
