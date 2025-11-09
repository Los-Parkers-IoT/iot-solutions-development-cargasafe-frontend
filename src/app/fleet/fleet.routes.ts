import { Routes } from '@angular/router';

export const FLEET_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'vehicles', loadComponent: () => import('./presentation/pages/vehicle-management/vehicle-management').then(m => m.VehicleManagementComponent) },
      { path: 'vehicles/:id', loadComponent: () => import('./presentation/pages/vehicle-detail-page/vehicle-detail-page').then(m => m.VehicleDetailPageComponent) },
      { path: 'devices', loadComponent: () => import('./presentation/pages/device-management/device-management').then(m => m.DeviceManagementComponent) },
      { path: 'devices/:id', loadComponent: () => import('./presentation/pages/device-detail-page/device-detail-page').then(m => m.DeviceDetailPageComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'vehicles' }
    ]
  }
];
