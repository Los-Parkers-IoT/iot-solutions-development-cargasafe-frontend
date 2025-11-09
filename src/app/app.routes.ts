import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import {VehicleManagementComponent} from './fleet/presentation/pages/vehicle-management/vehicle-management';
import {DeviceManagementComponent} from './fleet/presentation/pages/device-management/device-management';
import {VehicleDetailPageComponent} from './fleet/presentation/pages/vehicle-detail-page/vehicle-detail-page';
import {DeviceDetailPageComponent} from './fleet/presentation/pages/device-detail-page/device-detail-page';

// app.routes.ts (root)
export const routes: Routes = [
  {
    path: '',
    component: RootLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'fleet/vehicles' },
      { path: 'fleet', loadChildren: () => import('./fleet/fleet.routes').then(m => m.FLEET_ROUTES) },
      { path: '**', component: PageNotFound },
    ],
  },
];
