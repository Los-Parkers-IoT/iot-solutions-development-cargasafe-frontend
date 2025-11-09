import { Routes } from '@angular/router';

const listPage = () =>
  import('../presentation/pages/trip-list-page/trip-list-page').then((m) => m.TripListPage);
const detailPage = () =>
  import('../presentation/pages/trip-detail-page/trip-detail-page').then((m) => m.TripDetailPage);

export const routes: Routes = [
  {
    path: '',
    loadComponent: listPage,
  },
  {
    path: ':id',
    loadComponent: detailPage,
  },
];
