import React from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { AppLayout } from '@/app/AppLayout';
import { BottomBar } from '@/components/ui/home/BottomBar'; 
import { ThemeProvider } from '@/constants/ThemeProvider';

export default function Layout() {
  const isMobile = Platform.OS === 'android' || Platform.OS === 'ios';

  return (
    <ThemeProvider>
      {isMobile ? (
        <AppLayout>
          <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
            <BottomBar />
          </View>
        </AppLayout>
      ) : (
        <AppLayout>
          <Stack screenOptions={{ headerShown: false }} />
        </AppLayout>
      )}
    </ThemeProvider>
  );
}
