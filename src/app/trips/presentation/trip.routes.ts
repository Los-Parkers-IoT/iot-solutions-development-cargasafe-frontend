import { Routes } from '@angular/router';

const listPage = () =>
  import('../presentation/pages/trip-list-page/trip-list-page').then((m) => m.TripListPage);

export const routes: Routes = [
  {
    path: '',
    loadComponent: listPage,
  },
];
