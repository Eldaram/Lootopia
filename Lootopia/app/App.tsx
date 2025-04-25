import { HomeScreen } from '@/app/src/adapters/screens/Home/HomeScreen';
import { ThemeProvider } from '@/context/ThemeContext';
import React from 'react';

export default function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}