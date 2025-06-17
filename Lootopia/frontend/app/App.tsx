import { HomeScreen } from '@/app/src/adapters/screens/HomeScreen';
import React from 'react';
import './src/styles.css';
import { Route, Switch } from 'wouter';
import { ProfileScreen } from '@/app/src/adapters/screens/ProfileScreen';
import { AppLayout } from '@/app/AppLayout';
import { OrganisateurScreen } from '@/app/src/adapters/screens/OrganisateurScreen';
import HuntFormPage from '@/app/src/adapters/screens/HuntFormPage';

export default function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomeScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route path="/organiser" component={OrganisateurScreen} />
        <Route path="/hunt" component={HuntFormPage} />
        <Route path="/hunt/:id" component={HuntFormPage} />
        <Route>⚠️ Page non trouvée</Route>
      </Switch>
    </AppLayout>
  );
}
