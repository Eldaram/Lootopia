import { HomeScreen } from '@/app/src/adapters/screens/HomeScreen';
import React from 'react';
import './src/styles.css';
import { Route, Switch } from 'wouter';
import { ProfileScreen } from '@/app/src/adapters/screens/ProfileScreen';
import { AppLayout } from '@/app/AppLayout';
import { DashboardScreen } from '@/app/src/adapters/screens/DashboardScreen';
import LoginScreen from '@/app/src/adapters/screens/LoginScreen';

export default function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomeScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route path="/dashboard" component={DashboardScreen} />
        <Route path="/login" component={LoginScreen} />
        <Route>⚠️ Page non trouvée</Route>
      </Switch>
    </AppLayout>
  );
}
