import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { AlertsPageComponent } from './alerts/domain/components/alerts-page/alerts-page.component';
import {LoginPageComponent} from './iam/presentation/pages/login-page/login-page';
import {PasswordRecoveryPageComponent} from './iam/presentation/pages/password-recovery-page/password-recovery-page';
import {RegisterPageComponent} from './iam/presentation/pages/register-page/register-page';

const tripRoutes = () => import('./trips/presentation/trip.routes').then((m) => m.routes);

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },

  { path: 'password-recovery',
    component: PasswordRecoveryPageComponent },

  { path: 'register', component: RegisterPageComponent },

  {
    path: 'trips',
    loadChildren: tripRoutes,
  },
  {
    path: 'alerts',
    component: AlertsPageComponent,
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
