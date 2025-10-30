import { Routes } from '@angular/router';

const listPage = () =>
  import('../presentation/pages/alerts-page/alerts-page.component').then((m) => m.AlertsPageComponent);

export const routes: Routes = [
  {
    path: '',
    loadComponent: listPage,
  },
];
