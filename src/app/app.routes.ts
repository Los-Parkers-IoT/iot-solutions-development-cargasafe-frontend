import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { SubscriptionsPage } from './features/billing/presentation/pages/subscriptions/subscriptions.page';

export const routes: Routes = [
  {
    path: '',
    component: RootLayout,
    children: [
      { path: 'subscriptions', component: SubscriptionsPage },
      { path: '**', component: PageNotFound },
    ],
  },
];
