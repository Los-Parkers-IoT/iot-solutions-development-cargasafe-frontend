import { Routes } from '@angular/router';

const listPage = () =>
  import('../presentation/pages/trip-list-page/trip-list-page').then((m) => m.TripListPage);
const detailPage = () =>
  import('../presentation/pages/trip-detail-page/trip-detail-page').then((m) => m.TripDetailPage);
const createPage = () =>
  import('../presentation/pages/trip-create-page/trip-create-page.component').then((m) => m.TripCreatePageComponent);

export const routes: Routes = [
  {
    path: '',
    loadComponent: listPage,
  },
  {
    path: 'create',
    loadComponent: createPage,
  },
  {
    path: ':id',
    loadComponent: detailPage,
  },

];
