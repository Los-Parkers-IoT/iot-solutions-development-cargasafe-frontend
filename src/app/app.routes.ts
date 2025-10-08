import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { DashboardComponent } from './dashboard/presentation/pages/dashboard.component';
import { TripDetailComponent } from './dashboard/presentation/components/trip-detail/trip-detail.component';

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
        path: 'dashboard/trips/:id',
        component: TripDetailComponent,
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
