import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // We handle headers inside the screens
        tabBarActiveTintColor: '#7a0c0c', // Your brand color
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
      }}
    >
      {/* 1. HOME TAB */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2. COMPOSE TAB (The Big Plus Button) */}
      <Tabs.Screen
        name="compose"
        options={{
          title: 'Ask',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                top: -10, // Float it slightly above
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: '#7a0c0c',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#7a0c0c',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Ionicons name="add" size={32} color="#fff" />
            </View>
          ),
          tabBarLabelStyle: { display: 'none' }, // Hide label for the center button
        }}
      />

      {/* 3. PROFILE TAB */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
