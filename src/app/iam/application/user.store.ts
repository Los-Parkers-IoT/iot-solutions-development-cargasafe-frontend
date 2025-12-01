import { inject, Injectable, signal } from '@angular/core';
import { User } from '../domain/models/user.entity';
import { TokenRepository } from '../infrastructure/token-repository';
import { UserApi } from '../infrastructure/user-api';

@Injectable({ providedIn: 'root' })
export class UserStore {
  user = signal<User | null>(null);
  loadingUser = signal<boolean>(false);
  userApi = inject(UserApi);
  tokenRepository = inject(TokenRepository);

  loadUser() {
    const payload = this.tokenRepository.parseToken();

    if (!payload) {
      this.user.set(null);
      console.warn('No valid token found, cannot load user.');
      return;
    }

    const userId = (payload as any).uid;
    this.loadingUser.set(true);

    this.userApi.getUserById(userId).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loadingUser.set(false);
      },
      error: (err) => {
        this.user.set(null);
        console.error('Failed to load user:', err);
        this.loadingUser.set(false);
      },
    });
  }
}
