import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authentication } from './authentication';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from  '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Authentication);
  const router = inject(Router);

  const token = auth.accessToken();
  const isAuthEndpoint = /\/authentication\//.test(req.url);

  const withAuth = token && !isAuthEndpoint
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(withAuth).pipe(
    catchError((err: any) => {
      const is401 = err instanceof HttpErrorResponse && err.status === 401;
      const hasRefresh = !!auth.refreshToken();

      if (is401 && !isAuthEndpoint && hasRefresh) {
        return auth.refresh().pipe(
          switchMap((t) => {
            auth.saveTokens(t);
            const retried = req.clone({ setHeaders: { Authorization: `Bearer ${t.accessToken}` } });
            return next(retried);
          }),
          catchError((err2) => {
            auth.clearTokens();
            router.navigate(['/login']);
            return throwError(() => err2);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
