import React from 'react';

import { Stack } from 'expo-router';
import { AppLayout } from '@/app/AppLayout';

export default function Layout() {
  return (
    <AppLayout>
       <Stack screenOptions={{ headerShown: false }} />
    </AppLayout>
  );
}
