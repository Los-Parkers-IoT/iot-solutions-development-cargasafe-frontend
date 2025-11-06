import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Authentication } from './authentication';
import { Router } from '@angular/router';

export const logoutGuard: CanActivateFn = () => {
  const auth = inject(Authentication);
  const router = inject(Router);

  auth.revoke(true).subscribe({
    next: () => {},
    error: () => {},
    complete: () => {
      auth.clearTokens();
      router.navigate(['/login']);
    }
  });

  setTimeout(() => {
    auth.clearTokens();
    router.navigate(['/login']);
  }, 400);

  return false;
};
