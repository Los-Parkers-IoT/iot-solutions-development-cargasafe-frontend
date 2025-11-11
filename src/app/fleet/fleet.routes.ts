import { Routes } from '@angular/router';

export const FLEET_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'vehicles', loadComponent: () => import('./presentation/views/vehicle-management/vehicle-management').then(m => m.VehicleManagementComponent) },
      { path: 'vehicles/:id', loadComponent: () => import('./presentation/views/vehicle-detail-page/vehicle-detail-page').then(m => m.VehicleDetailPageComponent) },
      { path: 'devices', loadComponent: () => import('./presentation/views/device-management/device-management').then(m => m.DeviceManagementComponent) },
      { path: 'devices/:id', loadComponent: () => import('./presentation/views/device-detail-page/device-detail-page').then(m => m.DeviceDetailPageComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'vehicles' }
    ]
  }
];
