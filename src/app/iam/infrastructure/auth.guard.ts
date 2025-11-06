import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Authentication } from './authentication';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Authentication);
  return !!auth.accessToken();
};
