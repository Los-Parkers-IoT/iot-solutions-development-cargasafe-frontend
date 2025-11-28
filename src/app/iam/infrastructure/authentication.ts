import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type SignInRequest = { username: string; password: string; };
type TokenPair = { accessToken: string; refreshToken: string; };
type RefreshRequest = { refreshToken: string; };
type RevokeRequest = { refreshToken: string; allDevices?: boolean; };

const ACCESS_KEY = 'iam.accessToken';
const REFRESH_KEY = 'iam.refreshToken';

@Injectable({ providedIn: 'root' })
export class Authentication {
  private http = inject(HttpClient);
  private base = environment.baseUrl + environment.iamPath;

  accessToken = signal<string | null>(localStorage.getItem(ACCESS_KEY));
  refreshToken = signal<string | null>(localStorage.getItem(REFRESH_KEY));

  saveTokens(t: TokenPair) {
    localStorage.setItem(ACCESS_KEY, t.accessToken);
    localStorage.setItem(REFRESH_KEY, t.refreshToken);
    this.accessToken.set(t.accessToken);
    this.refreshToken.set(t.refreshToken);
  }

  clearTokens() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    this.accessToken.set(null);
    this.refreshToken.set(null);
  }


  signIn(body: { email: string; password: string }) {
    return this.http.post<TokenPair>(`${this.base}/sign-in`, body);
  }
  signUp(body: any) {
    return this.http.post<void>(`${this.base}/sign-up`, body);
  }
  refresh() {
    const rt = this.refreshToken();
    const body: RefreshRequest = { refreshToken: rt ?? '' };
    return this.http.post<TokenPair>(`${this.base}/refresh`, body);
  }
  revoke(allDevices = false) {
    const rt = this.refreshToken();
    const body: RevokeRequest = { refreshToken: rt ?? '', allDevices };
    return this.http.post<void>(`${this.base}/revoke`, body);
  }
}
