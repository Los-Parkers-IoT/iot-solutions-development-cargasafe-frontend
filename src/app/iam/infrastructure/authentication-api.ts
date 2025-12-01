import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SignInResponse } from './authentication-resources';

@Injectable({ providedIn: 'root' })
export class AuthenticationApi {
  private http = inject(HttpClient);
  private base = `${environment.baseUrl}/authentication`;

  signIn(email: string, password: string) {
    return this.http.post<SignInResponse>(`${this.base}/sign-in`, { username: email, password });
  }

  signUp(email: string, password: string, profile: { firstName: string; lastName: string }) {
    return this.http.post<void>(`${this.base}/sign-up`, { username: email, password, profile });
  }
}
