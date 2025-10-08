import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';

const tripRoutes = () => import('./trips/presentation/trip.routes').then((m) => m.routes);
const alertRoutes= () => import('./alerts/presentation/alert.routes').then((m) => m.routes);

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
        loadChildren: alertRoutes,
      },
      {
        path: '**',
        component: PageNotFound,
      },
    ],
  },
];
