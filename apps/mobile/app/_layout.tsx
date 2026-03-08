// apps/mobile/app/_layout.tsx
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Topics" }} />
        <Stack.Screen name="topic/[id]" options={{ title: "Topic Details" }} />
        <Stack.Screen name="search" options={{ title: "Search" }} />
      </Stack>
    </PaperProvider>
  );
}
