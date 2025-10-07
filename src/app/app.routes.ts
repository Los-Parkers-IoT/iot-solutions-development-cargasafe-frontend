import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import {AlertsPageComponent} from './features/alerts/domain/components/alerts-page/alerts-page.component';

export const routes: Routes = [
  {
    path: '',
    component: RootLayout,
    children: [
      {
        path: 'alerts',
        component: AlertsPageComponent,
      },
      {
        path: '',
        redirectTo: 'alerts',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: PageNotFound,
      },
    ],
  },
];
