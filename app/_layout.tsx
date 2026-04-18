import { Stack } from 'expo-router';
import { DoubtProvider } from '../context/DoubtContext'; // Import the provider

export default function RootLayout() {
  return (
    // Wrap the whole app in the Provider so data is shared everywhere
    <DoubtProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* The Tabs (Home, Post, Profile) */}
        <Stack.Screen name="(tabs)" />
        
        {/* The Detail Screen (Pushed on top of tabs) */}
        <Stack.Screen 
          name="post/[id]" 
          options={{ 
            headerShown: true, // Show header for back button
            title: 'Doubt Details',
            presentation: 'card' 
          }} 
        />
      </Stack>
    </DoubtProvider>
  );
}
