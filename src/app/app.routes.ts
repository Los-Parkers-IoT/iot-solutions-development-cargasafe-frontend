import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { AlertsPageComponent } from './alerts/domain/components/alerts-page/alerts-page.component';

const tripRoutes = () => import('./trips/presentation/trip.routes').then((m) => m.routes);

export const routes: Routes = [
  {
    path: '',
    component: RootLayout,
    children: [
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
    ],
  },
];
