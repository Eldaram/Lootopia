import { HomeScreen } from '@/app/src/adapters/screens/HomeScreen';
import React from 'react';
import './src/styles.css';
import { Route, Switch } from 'wouter';
import { ProfileScreen } from '@/app/src/adapters/screens/ProfileScreen';
import { AppLayout } from '@/app/AppLayout';
import CreateHuntScreen from '@/app/src/adapters/screens/CreateHuntScreen';

export default function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomeScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route path="/organiser" component={CreateHuntScreen} />
        <Route>⚠️ Page non trouvée</Route>
      </Switch>
    </AppLayout>
  );
}
