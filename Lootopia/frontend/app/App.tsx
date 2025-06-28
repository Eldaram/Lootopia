import { ThemeProvider } from '@/constants/ThemeProvider';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <ThemeProvider>
      <Slot /> 
    </ThemeProvider>
  );
}
