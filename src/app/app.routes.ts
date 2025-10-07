import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { DashboardComponent } from './features/dashboard/components/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: RootLayout,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'vehicles',
        component: PageNotFound, // Placeholder until you create this component
      },
      {
        path: 'sensors',
        component: PageNotFound, // Placeholder until you create this component
      },
      {
        path: 'trips',
        component: PageNotFound, // Placeholder until you create this component
      },
      {
        path: 'alerts',
        component: PageNotFound, // Placeholder until you create this component
      },
      {
        path: 'subscriptions',
        component: PageNotFound, // Placeholder until you create this component
      },
      {
        path: '**',
        component: PageNotFound,
      },
    ],
  },
];
