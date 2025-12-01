import { inject, Injectable } from '@angular/core';
import { AuthenticationApi } from '../infrastructure/authentication-api';
import { TokenRepository } from '../infrastructure/token-repository';
import { tap } from 'rxjs';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authApi = inject(AuthenticationApi);
  private tokenRepository = inject(TokenRepository);
  private userStore = inject(UserStore);

  signIn(email: string, password: string) {
    return this.authApi.signIn(email, password).pipe(
      tap((response) => {
        this.tokenRepository.save(response.accessToken, response.refreshToken);
      })
    );
  }
}
