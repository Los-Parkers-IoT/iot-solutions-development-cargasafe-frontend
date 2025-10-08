import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { AlertsPageComponent } from './alerts/domain/components/alerts-page/alerts-page.component';

const tripRoutes = () => import('./trips/presentation/trip.routes').then((m) => m.routes);
import { VehicleManagementComponent } from './fleet/presentation/pages/vehicle-management/vehicle-management';
import { DeviceManagementComponent } from './fleet/presentation/pages/device-management/device-management';
import { VehicleDetailPageComponent } from './fleet/presentation/pages/vehicle-detail-page/vehicle-detail-page';
import { DeviceDetailPageComponent } from './fleet/presentation/pages/device-detail-page/device-detail-page';

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
      { path: '', pathMatch: 'full', redirectTo: 'trips' },
      {
        path: 'fleet',
        children: [
          { path: 'vehicles', component: VehicleManagementComponent },
          { path: 'devices', component: DeviceManagementComponent },

          { path: 'vehicles/:id', component: VehicleDetailPageComponent },
          { path: 'devices/:id', component: DeviceDetailPageComponent },

          { path: '', pathMatch: 'full', redirectTo: 'vehicles' },
        ],
      },

      { path: '**', component: PageNotFound },
    ],
  },
];
