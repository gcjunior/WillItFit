import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AnalysisProvider } from '../context/AnalysisContext';

export default function RootLayout() {
  return (
    <AnalysisProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="summary" />
        <Stack.Screen name="packing" />
      </Stack>
    </AnalysisProvider>
  );
}
