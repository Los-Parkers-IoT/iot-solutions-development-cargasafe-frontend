import { Routes } from '@angular/router';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { AlertsPageComponent } from './alerts/domain/components/alerts-page/alerts-page.component';
import { authGuard } from './iam/infrastructure/auth.guard';
import { logoutGuard} from './iam/infrastructure/logout.guard';


import { LoginPageComponent } from './iam/presentation/pages/login-page/login-page';
import { PasswordRecoveryPageComponent } from './iam/presentation/pages/password-recovery-page/password-recovery-page';
import { RegisterPageComponent } from './iam/presentation/pages/register-page/register-page';
import { OtpVerificationComponent} from './iam/presentation/pages/otp-verification-page/otp-verification-page';
import { NewPasswordComponent} from './iam/presentation/pages/new-password-page/new-password-page';
import {RootLayout} from './shared/presentation/layout/root-layout/root-layout';
import {DashboardComponent} from './dashboard/presentation/pages/dashboard.component';
import {VehicleManagementComponent} from './fleet/presentation/pages/vehicle-management/vehicle-management';
import {DeviceManagementComponent} from './fleet/presentation/pages/device-management/device-management';
import {SubscriptionsPage} from './subscription/presentation/pages/subscriptions/subscriptions.page';

const tripRoutes = () => import('./trips/presentation/trip.routes').then((m) => m.routes);
const alertRoutes = () => import('./alerts/presentation/alert.routes').then((m) => m.routes);

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: 'password-recovery',
    children: [
      {
        path: '',
        component: PasswordRecoveryPageComponent,
        pathMatch: 'full'
      },
      {
        path: 'otp-verify',
        component: OtpVerificationComponent
      },
      {
        path: 'new-password',
        component: NewPasswordComponent
      }
    ]
  },

  {
    path: '',
    component: RootLayout,
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard],
        component: DashboardComponent
      },
      {
        path: 'trips',
        loadChildren: tripRoutes
      },
      {
        path: 'alerts',
        loadChildren: alertRoutes
      },
      {
        path: 'fleet',
        children: [
          { path: 'vehicles', component: VehicleManagementComponent },
          { path: 'devices', component: DeviceManagementComponent },
          { path: '', pathMatch: 'full', redirectTo: 'vehicles' }
        ]
      },
      {
        path: 'subscriptions',
        component: SubscriptionsPage
      },
      {
        path: 'logout',
        canActivate: [logoutGuard],
        component: LoginPageComponent
      }
    ]
  },

  {
    path: '**',
    component: PageNotFound
  }
];
