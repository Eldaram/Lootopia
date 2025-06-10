import React from 'react';

import { Stack } from 'expo-router';
import { AppLayout } from '@/app/AppLayout';
import { ThemeProvider } from '@/constants/ThemeProvider';

export default function Layout() {
  return (
    <ThemeProvider>
      <AppLayout>
        <Stack screenOptions={{ headerShown: false }} />
      </AppLayout>
  </ThemeProvider>
  );
}
