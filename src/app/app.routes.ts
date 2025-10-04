import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';

export const routes: Routes = [
  {
    path: '',
    component: RootLayout,
    children: [
      {
        path: '**',
        component: PageNotFound,
      },
    ],
  },
];
