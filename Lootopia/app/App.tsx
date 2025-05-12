import React from 'react';
import './src/styles.css';
import { HomeScreen } from '@/app/src/adapters/screens/HomeScreen';
import { AppLayout } from '@/app/AppLayout';


export default function App() {
  return (
    <AppLayout>
      <HomeScreen />
    </AppLayout>
  );
}
