import { Routes } from '@angular/router';
import { RootLayout } from './shared/presentation/layout/root-layout/root-layout';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { DashboardComponent } from './dashboard/presentation/pages/dashboard.component';
import { TripDetailComponent } from './dashboard/presentation/components/trip-detail/trip-detail.component';
import { LoginPageComponent } from './iam/presentation/pages/login-page/login-page';
import { PasswordRecoveryPageComponent } from './iam/presentation/pages/password-recovery-page/password-recovery-page';
import { RegisterPageComponent } from './iam/presentation/pages/register-page/register-page';
import { VehicleManagementComponent } from './fleet/presentation/pages/vehicle-management/vehicle-management';
import { DeviceManagementComponent } from './fleet/presentation/pages/device-management/device-management';
import { VehicleDetailPageComponent } from './fleet/presentation/pages/vehicle-detail-page/vehicle-detail-page';
import { DeviceDetailPageComponent } from './fleet/presentation/pages/device-detail-page/device-detail-page';
import { SubscriptionsPage } from './subscription/presentation/pages/subscriptions/subscriptions.page';

const tripRoutes = () => import('./trips/presentation/trip.routes').then((m) => m.routes);
const alertRoutes = () => import('./alerts/presentation/alert.routes').then((m) => m.routes);

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'password-recovery', component: PasswordRecoveryPageComponent },
  { path: 'register', component: RegisterPageComponent },
  {
    path: '',
    component: RootLayout,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'dashboard/trips/:id',
        component: TripDetailComponent,
      },
      {
        path: 'trips',
        loadChildren: tripRoutes,
      },
      {
        path: 'alerts',
        loadChildren: alertRoutes,
      },
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

      { path: 'subscriptions', component: SubscriptionsPage },

      { path: '**', component: PageNotFound },
    ],
  },
];
