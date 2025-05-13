import React from 'react';
import './src/styles.css';
import { Route, Switch } from 'wouter';
import { HomeScreen } from '@/app/src/adapters/screens/HomeScreen';
import { ProfileScreen } from '@/app/src/adapters/screens/ProfileScreen';
import { AppLayout } from '@/app/AppLayout';

export default function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomeScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route>⚠️ Page non trouvée</Route>
      </Switch>
    </AppLayout>
  );
}
