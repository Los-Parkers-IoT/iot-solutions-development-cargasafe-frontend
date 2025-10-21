import { Routes } from '@angular/router';
import { PageNotFound } from './shared/presentation/views/page-not-found/page-not-found';
import { AlertsPageComponent } from './alerts/domain/components/alerts-page/alerts-page.component';


import { LoginPageComponent } from './iam/presentation/pages/login-page/login-page';
import { PasswordRecoveryPageComponent } from './iam/presentation/pages/password-recovery-page/password-recovery-page';
import { RegisterPageComponent } from './iam/presentation/pages/register-page/register-page';
import { OtpVerificationComponent} from './iam/presentation/pages/otp-verification-page/otp-verification-page';
import { NewPasswordComponent} from './iam/presentation/pages/new-password-page/new-password-page';

const tripRoutes = () => import('./trips/presentation/trip.routes').then((m) => m.routes);

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },

  { path: 'register',
    component: RegisterPageComponent
  },

  {
    path: 'password-recovery',
    children: [
      { path: '',
        component: PasswordRecoveryPageComponent,
        pathMatch: 'full'
      },
      { path: 'otp-verify',
        component: OtpVerificationComponent
      },
      { path: 'new-password',
        component: NewPasswordComponent
      },
    ]
  },
  {
    path: 'trips',
    loadChildren: tripRoutes,
  },
  {
    path: 'alerts',
    component: AlertsPageComponent,
  },

  // Ruta Wildcard
  {
    path: '**',
    component: PageNotFound,
  },
];
